// Forked from https://github.com/OI-wiki/gatsby-oi-wiki
// Details: https://blog.mgt.moe/posts/physics-based-animation/

/**
 * 获取动画进行 progress 时，物体的位移
 * 该动画曲线是阻尼振动模型。弹簧的劲度系数是 500，阻力系数是 100，物体质量为 3
 * @param progress - 动画的播放进度，[0, 1] 之间的实数
 * @returns - 返回物体的位移百分比，[0, 1] 之间的实数
 * 动画曲线的方程为 f(x) = 1.00283 * (
 * \frac{1}{4} \, {\left(\sqrt{10} - 2\right)} e^{\left(-\frac{10}{3} \, x {\left(\sqrt{10} + 5\right)}\right)} -
 * \frac{1}{4} \, {\left(\sqrt{10} + 2\right)} e^{\left(\frac{10}{3} \, x {\left(\sqrt{10} - 5\right)}\right)} + 1
 * )
 * 可使用如下 sagemath 代码计算出动画曲线：
 * t = var('t')
 * y = function('y')(x)
 *
 * k = 500        # 劲度系数 F_k = k * x
 * stiffness = 100 # 阻力系数 F_f = stiffness * v
 * m = 3           # 质量
 *
 * res = desolve(diff(y, x, 2) == (-k*(y - 1) - stiffness*diff(y, x))/m, y, ics=[0, 0, 0])
 * res = res * 1.00283
 * show(res)
 * show(N(res(1)))
 * plot(res, xmin=0)
 * */
export function getDisplacement(progress) {
  if (progress < 0) return 0;

  function f(t) {
    return (
      1 +
      0.25 *
        (1.1622776601683795 * Math.exp((-10 / 3) * t * 8.16227766016838) -
          5.16227766016838 * Math.exp((10 / 3) * t * -1.8377223398316205))
    );
  }

  return f(progress) * 1.00283;
}

/**
 * smoothScrollTo - 平滑滚动到指定的 y 坐标
 *
 * @param yCoordinate
 * @param duration 移动动画的持续时间，用毫秒表示, 若值为 -1，表明由距离决定
 * @param optimizeForSmallScreen 为小屏幕使用 CSS 动画来解决性能问题
 */
export function smoothScrollTo(element, yCoordinate, duration = -1, optimizeForSmallScreen = true) {
  const maximumCoordinate = element.scrollHeight - window.innerHeight;
  const offset = Math.min(yCoordinate, maximumCoordinate) - element.scrollTop;
  const isSmallScreen = window.innerWidth <= 600;

  if (isSmallScreen && optimizeForSmallScreen) {
    element.scrollTo({ top: yCoordinate, behavior: "smooth" });
    return;
  }

  if (duration === -1) {
    const absOffset = Math.abs(offset);
    duration = 300 + Math.sqrt((2 * absOffset) / 0.02);
  }

  const startPosition = element.scrollTop;
  // element.scrollTop = yCoordinate;

  const startTime = performance.now();
  const performAnimation = time => {
    if (time - startTime > duration) {
      element.style.transform = "";
      return;
    }

    const displacement = offset * getDisplacement((time - startTime) / duration);
    element.scrollTop = displacement + startPosition;
    requestAnimationFrame(performAnimation);
  };
  requestAnimationFrame(performAnimation);
}
