import { useState } from "react";
import Input from "./components/Input";
import Results from "./components/Results";
import TabButton from "./components/TabButton";


function App() {
  const [userInput, setUserInput] = useState({
    initialInvestment: 10000,
    annualInvestment: 1200,
    expectedReturn: 6,
    duration: 10
  });

  const [selectedFund, setSelectedFund] = useState("SP500");

  const inputIsValid = userInput.duration >= 1;

  function handleFundChange(fund){
    setSelectedFund(fund);

    fetch(`http://localhost:3000/api/${encodeURIComponent(fund)}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(data => {
      console.log("Server response:", data);
      // setFundData(data); ← store response in state if needed
    })
    .catch(err => {
      console.error("Error fetching fund data:", err);
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

      {inputIsValid ? <Results input={userInput} /> :
       <p className="center">Please enter a duration gretaer than zero</p>}
    </>
  )
}

export default App
