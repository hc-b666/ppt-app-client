import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { useFindAllPresentationsQuery } from "./presentationService";
import { formatDate } from "@/common/lib/utils";
import { Button } from "@/common/components/ui/button";

const headerCols = ["Title", "Description", "Author", "Created At", "Actions"];

export default function PresentationsList() {
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
                  <Link to={`/main/presentations/${ppt.id}`}>
                    <Button>Join</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
