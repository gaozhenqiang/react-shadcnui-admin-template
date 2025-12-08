/**
 * 正则表达式工具
 * 统一管理项目中使用的正则校验规则
 */

/**
 * 手机号正则表达式
 * 支持中国大陆手机号：13x, 14x, 15x, 16x, 17x, 18x, 19x
 */
export const PHONE_REGEX = /^1[3-9]\d{9}$/

/**
 * 身份证号正则表达式
 * 支持15位和18位身份证号
 */
export const ID_CARD_REGEX = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

/**
 * 邮箱正则表达式
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * 验证手机号格式
 */
export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone)
}

/**
 * 验证身份证号格式
 */
export function isValidIdCard(idCard: string): boolean {
  return ID_CARD_REGEX.test(idCard)
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

