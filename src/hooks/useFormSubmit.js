import { toast } from "react-hot-toast";
import { useFormContext } from "../context/FormContext";
import { useModalContext } from "../context/ModalContext";
import { addDocument, createNotification, getAllDocuments } from "../firebase/firestore";
import { CATEGORY_OPTIONS } from "../data/categoryData";
import useCurrencyStore from "../store/useCurrencyStore";
import useTransactionStore from "../store/useTransactionStore";
import { formatAmount } from "../utils/formatAmount";
import { generateCategoryKey } from "../utils/generateKey";
import { getSnakeCaseValue } from "../utils/snakeCaseValue";
import { categoryNameExists } from "../utils/categoryName";

const FORM_LABELS = {
  TRANSACTIONS: "transactions",
  BUDGETS: "budgets",
  GOALS: "goals",
  CONTRIBUTIONS: "contributions",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const singularLabel = (label) =>
  (label[0].toUpperCase() + label.slice(1)).slice(0, -1);

const getFormType = (label) => ({
  isTransaction: label === FORM_LABELS.TRANSACTIONS,
  isBudget: label === FORM_LABELS.BUDGETS,
  isGoal: label === FORM_LABELS.GOALS,
  isContribution: label === FORM_LABELS.CONTRIBUTIONS,
});

const hasSupportedLabel = ({
  isTransaction,
  isBudget,
  isGoal,
  isContribution,
}) => isTransaction || isBudget || isGoal || isContribution;

const resolveCategoryValue = ({ data, isTransaction, isBudget }) => {
  const selectedCategory = data.category?.trim() || "";
  const customCategory = data.name?.trim() || "";

  if (isTransaction || isBudget) {
    return customCategory || selectedCategory;
  }

  return customCategory;
};

const buildCategoryKey = ({ categoryValue, type, isTransaction, isBudget }) => {
  if (isTransaction || isBudget) {
    return generateCategoryKey({ prefix: type, category: categoryValue });
  }

  return generateCategoryKey({ prefix: "goal", category: categoryValue });
};

const buildFormRecord = ({ data, editTransaction, formType, mode }) => {
  const { isTransaction, isBudget } = formType;
  const categoryValue = resolveCategoryValue({ data, isTransaction, isBudget });
  const type = isTransaction || isBudget ? data.type : null;

  const record = {
    name: getSnakeCaseValue(categoryValue),
    category: getSnakeCaseValue(categoryValue),
    categoryKey: buildCategoryKey({
      categoryValue,
      type,
      isTransaction,
      isBudget,
    }),
    amount: data.amount,
    type,
    date: data.date,
    description: data.description,
  };

  if (mode !== "add" && editTransaction?.id) {
    record.id = editTransaction.id;
  }

  return record;
};

const shouldSaveCustomCategory = ({ data, formType, mode }) => {
  const { isTransaction, isBudget } = formType;
  return mode !== "edit" && Boolean(data.name?.trim()) && (isTransaction || isBudget);
};

const saveCustomCategoryIfNew = async (userUID, record) => {
  const storedCategories = (await getAllDocuments(userUID, "categories")) ?? [];
  const knownCategories = [...CATEGORY_OPTIONS, ...storedCategories];

  if (categoryNameExists(record.category, knownCategories)) return;

  await addDocument(userUID, "categories", {
    name: record.category,
    categoryKey: record.categoryKey,
  });
};

const shouldCreateLargeExpenseNotification = ({
  label,
  record,
  transactionThreshold,
}) =>
  label === FORM_LABELS.TRANSACTIONS &&
  record.type === "expense" &&
  Number(record.amount) >= Number(transactionThreshold);


const useFormSubmit = (label, mode) => {
  const forms = useFormContext(label);
  const { reset, handleSubmit } = forms;
  const { onCloseModal } = useModalContext();
  const { editTransaction, addTransactionToStore, updateTransaction } =
    useTransactionStore();

  const formType = getFormType(label);

  const syncWithRetry = async (syncOperation) => {
    try {
      await syncOperation();
    } catch {
      await delay(1200);
      await syncOperation();
    }
  };

  const onSubmit = async (data, userUID, transactionID, transactionThreshold) => {
    const { selectedCurrency } = useCurrencyStore.getState();

    if (!hasSupportedLabel(formType)) return;

    const record = buildFormRecord({
      data,
      editTransaction,
      formType,
      mode,
    });

    const runSync = async () => {
      if (mode === "edit") {
        await updateTransaction(userUID, label, transactionID, record);
      } else {
        await addTransactionToStore(userUID, label, record);

        if (shouldSaveCustomCategory({ data, formType, mode })) {
          await saveCustomCategoryIfNew(userUID, record);
        }
      }

      if (
        shouldCreateLargeExpenseNotification({
          label,
          record,
          transactionThreshold,
        })
      ) {
        await createNotification(userUID, {
          subject: "Large Expense Alert",
          message: `You recorded an expense transaction of ${formatAmount(
            record.amount,
            selectedCurrency,
          )} for "${
            record.category
          }", which is higher than your set threshold of ${formatAmount(
            transactionThreshold,
            selectedCurrency,
          )}. Keep an eye on your spending.`,
          type: "transaction",
        });
      }
    };

    try {
      await syncWithRetry(runSync);

      onCloseModal(label);
      reset();

      toast.success(
        `${singularLabel(label)} ${
          mode === "add" ? "added" : "updated"
        } successfully`,
        {
          duration: 3000,
          position: "top-center",
        },
      );

      return "Transaction synced";
    } catch {
      toast.error(
        `Could not sync this ${label.slice(0, -1)}. Please try again: "${
          record.category
        }" (${formatAmount(record.amount, selectedCurrency)}).`,
        {
          duration: 5000,
          position: "top-center",
        },
      );
    }
  };

  return {
    handleSubmit,
    onSubmit,
  };
};

export default useFormSubmit;
