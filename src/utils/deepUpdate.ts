/**
 * updated에 업데이트할 프로퍼티 값을 넘겨주면, target 객체를 부수효과를 통해 업데이트하는 함수
 * @param updated 업데이트 할 프로퍼티만 들어있는 객체
 * @param target 업데이트 하고 싶은 객체
 * @returns void
 */

export default function deepUpdate(updated: any, target: any): void {
  if (!updated || typeof updated !== "object") return;

  Object.keys(updated).forEach((key) => {
    // 원시값인 경우
    if (typeof updated[key] !== "object" || updated[key] === null) {
      target[key] = updated[key];
      return;
    }

    // 객체 또는 배열인 경우
    Object.keys(updated).forEach((key) => {
      deepUpdate(updated[key], target[key]);
    });
  });

  return;
}
