const initState = {
    loading: false,
    industry:'',
    skill:'',
    userInput:"",
    adduser:[]
}
export default (state = initState, action) => {
    const {type, payload} = action ;
    switch (type){
        case "SET_LOADING":
            return {
                ...state,
                loading:payload
            }

        case "SET_INDUSTRY":
            return{
                ...state,
                industry:payload
            }

        case "SET_SKILL":
            return{
                ...state,
                skill:payload
            }
        case "USER_INPUT":
            return{
                ...state,
                userInput:payload
            }

        case "ADD_USER":
             return{
                ...state,
                 adduser:payload
                }
    
        default :{
            return {...state}
            
        }
    }
}