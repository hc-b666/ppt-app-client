import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import {
  useFindAllPresentationsQuery,
  useVerifyAuthorMutation,
} from "./presentationService";
import { formatDate } from "@/common/lib/utils";
import { Button } from "@/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";
import { Input } from "@/common/components/ui/input";
import { addClaim, selectAuthorToken } from "./presentationsSlice";
import { toast } from "@/common/hooks/use-toast";

const headerCols = ["Title", "Description", "Author", "Created At", "Actions"];

export default function PresentationsList() {
  const [step, setStep] = useState<1 | 2>(1);
  const { data, isLoading, isError, isSuccess, error } =
    useFindAllPresentationsQuery();

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    console.log(error);
  }

  return (
    <div className="w-[920px]">
      <Table>
        <TableHeader>
          <TableRow>
            {headerCols.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            data.map((ppt) => (
              <TableRow key={ppt.id}>
                <TableCell>{ppt.title}</TableCell>
                <TableCell>
                  {ppt.description ? ppt.description : "No description"}
                </TableCell>
                <TableCell>{ppt.author}</TableCell>
                <TableCell>{formatDate(ppt.createdAt)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Join</Button>
                    </DialogTrigger>
                    {step === 1 ? (
                      <Step1 ppt={ppt} setStep={setStep} />
                    ) : (
                      <Step2 ppt={ppt} setStep={setStep} />
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface StepProps {
  ppt: Presentation;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
}

function Step1({ ppt, setStep }: StepProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Join presentation room</DialogTitle>
        <DialogDescription>
          If you are author of the template continue and in the next step add
          your token to verify that you are really author of this template
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={() => setStep(2)}>Continue as author</Button>
        <Link to={`/main/presentations/${ppt.id}`}>
          <Button>Join as viewer</Button>
        </Link>
      </DialogFooter>
    </DialogContent>
  );
}

function Step2({ ppt, setStep }: StepProps) {
  const authorToken = useAppSelector((s) => selectAuthorToken(s, ppt.id));
  const [token, setToken] = useState(authorToken || "");
  const [verifyAuthor, { isLoading }] = useVerifyAuthorMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleVerifyAuthor = async () => {
    try {
      const { isAuthor } = await verifyAuthor({
        pptId: ppt.id,
        authorToken: token,
      }).unwrap();
      if (isAuthor) {
        dispatch(addClaim({ presentationId: ppt.id, authorToken: token }));
        navigate(`/main/presentations/${ppt.id}`);
      } else {
        toast({
          variant: "destructive",
          description:
            "Not verified. You are not author of this template or token is wrong",
        });
      }
    } catch (err) {
      console.log(err);
      toast({ variant: "destructive", description: "Something went wrong" });
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Enter your token</DialogTitle>
      </DialogHeader>
      <Input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="AuthorToken"
      />
      <DialogFooter>
        <Button onClick={() => setStep(1)}>Back</Button>
        <Button onClick={handleVerifyAuthor} disabled={isLoading}>
          {isLoading ? "Verifying" : "Join as author"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
