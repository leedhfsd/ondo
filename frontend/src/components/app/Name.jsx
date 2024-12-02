import { useState } from "react";
import './Name.css'
import Button2 from './Button2'
import name_bottom from "./../../assets/images/name_bottom.png";

import editname from './../../assets/images/edit-2.png'

const Name = () => {
  const [name, InpNameState] = useState('다람이')
  const [togleName, TogleNameState] = useState(true)
  const onClickEdit = () =>{
    TogleNameState(!togleName)
  }
  const onClickSave = () =>{
    console.log('확인용', name)
    // 이름 저장 로직 작성해야 함
    TogleNameState(!togleName)
  }
  return(
    <div id="Namepage">
      <div className="Name-content">
        {togleName? 
        <div className="before-edit">
          <p>{name}</p>
          <img onClick={onClickEdit} style={{cursor: "pointer"}} src={editname} />
        </div>
        :
        <div className="name-edit">
          <input type="text" value={name} onChange={(e) => InpNameState(e.target.value)}/>
          <div>
            <button onClick={onClickSave}><p>저장</p></button>
          </div>
        </div>
        }
      </div>
      {/* <div id="name-back"></div> */}
    {/* <img id='name-bottom' src={name_bottom} /> */}
    </div>
  )
}

export default Name;