import "./ExperimentConfigView.css";
import { ImprovementsEnum, TestSuitesEnum, selectUseLLM, setUseLLM } from "./ExperimentConfigSlice";
import { useSelector } from "react-redux";
import { setImprovement, setTestSuite, setUse } from "./ExperimentConfigSlice";
import { selectImprovement, selectTestSuite } from "./ExperimentConfigSlice";
import { useDispatch } from "react-redux";
import { Select, useId } from "@fluentui/react-components";

export function ExperimentConfigView() {
  const dispatch = useDispatch();
  const currImprovement = useSelector(selectImprovement);
  const currTestSuite = useSelector(selectTestSuite);
  const useLLM = useSelector(selectUseLLM);

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
        <label>Use LLM</label>
        <Select defaultValue={useLLM} onChange={(e) => dispatch(setUseLLM(e.target.value))}>
          <option key={"true"} value={true}>{"true"}</option>
          <option key={"false"} value={false}>{"false"}</option>
        </Select>
      </>
      <>
        <label>Test Suites</label>
        <Select defaultValue={currTestSuite} onChange={(e) => dispatch(setTestSuite(e.target.value))}>
        {Object.entries(TestSuitesEnum).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
        </Select>
      </>
    </div>
  );
}
