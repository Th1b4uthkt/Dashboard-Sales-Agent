import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LLM {
  id: string;
  name: string;
  provider: string;
}

interface LLMListProps {
  llms: LLM[];
}

export function LLMList({ llms }: LLMListProps) {
  if (llms.length === 0) {
    return <div>No LLMs available.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLMs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Provider</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {llms.map((llm) => (
              <TableRow key={llm.id}>
                <TableCell className="font-medium">{llm.id}</TableCell>
                <TableCell>{llm.name}</TableCell>
                <TableCell>{llm.provider}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
