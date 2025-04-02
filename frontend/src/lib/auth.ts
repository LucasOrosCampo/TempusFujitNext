import tokenService from '@/utils/token';
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export function logout(router: AppRouterInstance) {
    tokenService.clearToken()
    router.push('/login')
}