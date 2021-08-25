export const setLoading = (loading) => dispatch => {
    dispatch({type: "SET_LOADING", payload: loading});
}

export const selectIndustry = (industry) => dispatch => {
    dispatch({type: "SET_INDUSTRY", payload: industry});
}

export const skillSet=(skill)=>dispatch=>{
    dispatch({type:"SET_SKILL",payload:skill});
}

export const selectMannual=(userInput)=>dispatch=>{
    dispatch({type:"USER_INPUT",payload:userInput});
}


export const AddUserInput=(addUser)=>dispatch=>{
    dispatch({type:"ADD_USER",payload:addUser});

}