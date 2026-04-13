<template>
  <div class="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="absolute sakura-petal"
      :style="petal.style"
    />
  </div>
</template>

<script setup>
const petals = Array.from({ length: 35 }, (_, i) => {
  const left = Math.random() * 100
  const delay = Math.random() * 15
  const duration = 10 + Math.random() * 10
  const size = 6 + Math.random() * 10
  const drift = -30 + Math.random() * 60
  return {
    id: i,
    style: {
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      width: `${size}px`,
      height: `${size}px`,
      '--drift': `${drift}px`,
      opacity: 0.25 + Math.random() * 0.45,
    },
  }
})
</script>

<style scoped>
.sakura-petal {
  top: -20px;
  background: radial-gradient(ellipse at 30% 30%, #ffc0cb, #ff85a2 60%, transparent 70%);
  border-radius: 80% 0 55% 50% / 55% 0 80% 50%;
  animation: sakura-fall linear infinite;
}

@keyframes sakura-fall {
  0% {
    transform: translateY(-5vh) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(25vh) translateX(var(--drift)) rotate(90deg);
  }
  50% {
    transform: translateY(50vh) translateX(calc(var(--drift) * -0.5)) rotate(180deg);
  }
  75% {
    transform: translateY(75vh) translateX(var(--drift)) rotate(270deg);
  }
  100% {
    transform: translateY(108vh) translateX(0) rotate(360deg);
    opacity: 0;
  }
}
</style>
