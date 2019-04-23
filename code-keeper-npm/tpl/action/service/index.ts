/**
 * @desc service api
 */

// import { fetch } from '../util'
import APIRoot from '@/common/config/env'

/** 获取用户数据 **/
export function getUserInfo() {
  return fetch(`${APIRoot}/member`)
}

export function api(p1: string) {
  console.log('param:' + p1)
  return APIRoot
}