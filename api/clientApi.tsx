import { create } from "apisauce";
const apiClient = create({
//  baseURL: 'http://10.200.201.163:3000',
 baseURL: 'http://192.168.0.35:3000',
 headers: { Accept: 'application/vnd.github.v3+json' },
})
export default apiClient