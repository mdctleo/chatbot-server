import "./ExperimentConfigView.css";
import { ImprovementsEnum, TestSuitesEnum } from "./ExperimentConfigSlice";
import { useSelector } from "react-redux";
import { setImprovement, setTestSuite } from "./ExperimentConfigSlice";
import { selectImprovement, selectTestSuite } from "./ExperimentConfigSlice";
import { useDispatch } from "react-redux";
import { Select, useId } from "@fluentui/react-components";

export function ExperimentConfigView() {
  const dispatch = useDispatch();
  const currImprovement = useSelector(selectImprovement);
  const currTestSuite = useSelector(selectTestSuite);

  return (
    <div className="experiment-config-view">
      <>
        <label>Improvements</label>
        <Select defaultValue={currImprovement} onChange={(e) => dispatch(setImprovement(e.target.value))}>
        {Object.entries(ImprovementsEnum).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
        </Select>
      </>
      <>
        <label>Test Suites</label>
        <Select defaultValue={currTestSuite} onChange={() => console.log("onChange")}>
        {Object.entries(TestSuitesEnum).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
        </Select>
      </>
    </div>
  );
}