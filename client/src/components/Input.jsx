export default function Input({description, userInput, handleChange}){
    return(
        <div>
            <label>{description}</label>
            <input type="number" value={userInput} onChange={handleChange} required/>
        </div>
    );
}