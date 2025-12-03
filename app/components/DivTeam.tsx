import { Row } from "react-bootstrap";

interface DivTeamProps {
  team: string;
  children: React.ReactNode;
}

export default function DivTeam({ team, children }: DivTeamProps) {
  return (
    <div>
      <h2 className="text-primary my-4">{team}</h2>
      <Row className="justify-content-center row-gap-4">{children}</Row>
    </div>
  );
}
