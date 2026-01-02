import { useState } from "react";
import { twelveDataExtract, eodhdDataExtract, calculateAnnualReturn } from "./util/investment.js";
import Input from "./components/Input";
import Results from "./components/Results";
import TabButton from "./components/TabButton";
import CircularProgress from '@mui/material/CircularProgress';


function App() {
  const [userInput, setUserInput] = useState({
    initialInvestment: 10000,
    annualInvestment: 1200,
    expectedReturn: 6,
    duration: 10
  });

  const [selectedFund, setSelectedFund] = useState("SP500");
  const [isCalculatingReturn, setIsCalculatingReturn] = useState(false);

  const inputIsValid = userInput.duration >= 1;

  function handleFundChange(fund){
    setSelectedFund(fund);
    setIsCalculatingReturn((oldState) => !oldState);

    fetch(`${import.meta.env.VITE_API_URL}/api/${encodeURIComponent(fund)}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(data => {
      console.log("Server response:", data);
      let extractedValues;
      if(fund ==="SP500" || fund === "Nasdaq"){
        extractedValues = twelveDataExtract(data);
      }else{
        extractedValues = eodhdDataExtract(data);
      }
      return extractedValues;
    })
    .then(extractedValues => {
      const [lastYearValue, thisYearValue] = extractedValues;
      console.log("Extracted values:", lastYearValue, thisYearValue);
      return calculateAnnualReturn(lastYearValue, thisYearValue);
    }).then(annualReturn => {
      console.log("Calculated annual return:", annualReturn);
      handleChange("expectedReturn", annualReturn);
    })
    .catch(err => {
      console.error("Error fetching fund data:", err);
    })
    .finally(() => {
      setIsCalculatingReturn((oldState) => !oldState);
    });
  }

  function handleChange(inputIdentifier, newValue){
    setUserInput((oldState) => {
      return {
        ...oldState,
        [inputIdentifier]: newValue
      };
    });
  }


  return (
    <>  
      <div id="user-input">
        <div className="input-group">
          <Input description="initial investment" userInput={userInput.initialInvestment} handleChange={(event) => handleChange('initialInvestment', +event.target.value)}/>
          <Input description="annual investment" userInput={userInput.annualInvestment} handleChange={(event) => handleChange('annualInvestment', +event.target.value)}/>
        </div>
        <div className="input-group">
          <Input description="expected return" userInput={userInput.expectedReturn} handleChange={(event) => handleChange('expectedReturn', +event.target.value)}/>
          <Input description="duration" userInput={userInput.duration} handleChange={(event) => handleChange('duration', +event.target.value)}/>
        </div>
      </div>

      <div id="fund-selection" className="center">
          <ul id="funds-list">
            <TabButton isActive={selectedFund === "SP500"} onSelect={() => handleFundChange("SP500")}>S&P500</TabButton>
            <TabButton isActive={selectedFund === "Nasdaq"} onSelect={() => handleFundChange("Nasdaq")}>Nasdaq</TabButton>
            <TabButton isActive={selectedFund === "FTSE_Europe"} onSelect={() => handleFundChange("FTSE_Europe")}>FTSE 100</TabButton>
            <TabButton isActive={selectedFund === "STOXX50"} onSelect={() => handleFundChange("STOXX50")}>STOXX 50</TabButton>
          </ul>
        </div>

      {inputIsValid ? (
        isCalculatingReturn ? (
          <div className="center pt-10">
            <CircularProgress size={80} sx={{ color: '#76c0ae' }}/>
          </div>
        ) : (
        <Results input={userInput} /> 
      )) : (
        <p className="center">Please enter a duration gretaer than zero</p>
      )}
    </>
  )
}

export default App
