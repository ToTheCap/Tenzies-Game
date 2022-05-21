import "../Style.css";

export default function Dice(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    
    return(
        <div style={styles} className="dice" onClick={props.holdDice}>
            <p>{props.value}</p>
        </div>
    )
}