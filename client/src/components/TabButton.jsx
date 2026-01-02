export default function TabButton({isActive, onSelect, children}){
    return(
        <li>
            <button className={isActive ? "active font-roboto" : "undefined"} onClick={onSelect}>{children}</button>
        </li>
    );
}