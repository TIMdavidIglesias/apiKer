import { IFilterArgs } from "../../../../../ker/src/models/controller/types"

export const RefreshToken = async (args:any) => {
    const res = args.RESPONSE.getResponse()
    // args.SESSION.updateSession()
    return args.RESULT.dispatch(res.auth.email)

}