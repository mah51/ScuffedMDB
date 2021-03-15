import { data } from "../data";
import { Card } from "./Card";

export const CardGrid = () => {
  return (
    <div>
      {data.map((movie) => {
        console.log("looping");
        return <Card />;
      })}
    </div>
  );
};
