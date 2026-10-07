import { useMainContext } from "../../context/MainContext";
import { doSignOut } from "../../firebase/auth";
import useAuthStore from "../../store/useAuthStore";
import Dialog from "../ui/Dialog";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "../../demo/useDemoMode";
import { FiLogOut, FiX } from "react-icons/fi";

const UserInfo = ({name, email}) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full flex items-center gap-3 p-3 border border-border rounded-xl">
      <p className="h-10 min-w-10 flex justify-center items-center text-lg bg-muted-foreground text-white rounded-full">{initials}</p>

      <div>
        <h3 className="text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}

const SignoutPrompt = () => {
  const isDemoMode = useDemoMode();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setUserName = useAuthStore((state) => state.setUserName);
  const { isSignoutPromptOpen, handleSignoutPromptClose } = useMainContext();

  if (!isSignoutPromptOpen) return null;
  
  const onSignOut = () => {
    handleSignoutPromptClose();
    
    if (isDemoMode) {
      navigate("/login");
      return;
    }
    
    doSignOut();
    
    setTimeout(() => {
      setCurrentUser(null);
      setUserName((prev) => ({ ...prev, initials: "", fullName: "" }));
    }, 1000);
  };

  const userName = `${currentUser.firstName} ${currentUser.lastName}`;
  
  return (
    <Dialog
      ariaLabelledBy="signout-title"
      ariaDescribedBy="signout-description"
      onClose={handleSignoutPromptClose}
      padded={false}
      className="max-w-[420px] overflow-hidden p-0!"
    >
      <header className="space-y-3.5 border-b border-border bg-background px-6 py-5">
        <div className="flex items-center gap-3">
          <h2 id="signout-title" className="min-w-0 flex-1 font-display text-lg font-semibold">
            {isDemoMode ? "Exit demo session?" : "Log out of Vydra?"}
          </h2>

          <Button
            variant="ghost"
            className="size-10 min-h-10 shrink-0 p-0!"
            onClick={handleSignoutPromptClose}
            aria-label="Close sign out prompt"
            title="Close sign out prompt"
            >
            <FiX size={18} aria-hidden="true" />
          </Button>
        </div>
        
        {(!isDemoMode && currentUser?.email && userName ) && (
          <>
            <UserInfo name={userName} email={currentUser.email} />
            
            <p className="text-sm text-muted-foreground">You'll need to log in again to access your account.</p>
          </>
        )}
      </header>
      

      <footer className="flex flex-col-reverse gap-2 border-t border-border bg-surface px-6 py-4 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={handleSignoutPromptClose}>
          Stay signed in
        </Button>
        <Button variant="destructive" onClick={onSignOut}>
          <span className="flex items-center justify-center gap-2">
            <FiLogOut aria-hidden="true" />
            {isDemoMode ? "Exit demo" : "Log out"}
          </span>
        </Button>
      </footer>
    </Dialog>
  );
};

export default SignoutPrompt;
