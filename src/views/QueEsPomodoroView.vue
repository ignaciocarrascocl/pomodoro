<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col">
        <div class="content-card">
          <h1 class="text-center mb-4">Qué es Pomodoro</h1>
          <p class="text-justify">
            La Técnica Pomodoro, ideada por Francesco Cirillo a finales de los 80, es un método de
            gestión del tiempo sorprendentemente sencillo pero muy efectivo. Inspirado en el
            temporizador de cocina con forma de tomate ("pomodoro" en italiano), el método divide el
            trabajo en bloques de tiempo enfocados, tradicionalmente de 25 minutos, separados por
            breves descansos. Tras completar cuatro "pomodoros", se toma un descanso más largo para
            recargar energías antes de continuar con el siguiente ciclo.
          </p>
          <p class="text-justify">
            El funcionamiento es simple: eliges una tarea, ajustas el temporizador a 25 minutos y
            trabajas en ella de forma concentrada hasta que suene la alarma. Luego, tomas un breve
            descanso de unos 5 minutos. Cada cuatro pomodoros, te permites un descanso más extenso,
            usualmente de 15 a 30 minutos. Esta estructura ayuda a mantener la concentración y a
            combatir la procrastinación, creando un sentido de urgencia y progreso constante.
          </p>
          <p class="text-justify">
            ¿Por qué funciona tan bien? La Técnica Pomodoro aprovecha varios principios psicológicos.
            Los bloques de trabajo cortos y definidos hacen que las tareas parezcan menos abrumadoras
            y más fáciles de abordar. Los descansos regulares ayudan a prevenir el agotamiento mental
            y a mantener la motivación alta. Además, el seguimiento de los pomodoros completados
            proporciona una sensación de logro que impulsa la productividad y la autodisciplina.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica adicional
</script>

<style scoped>
.content-card {
  background-color: var(--color-background-soft);
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--color-border);
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: var(--color-heading);
  font-weight: 700;
  margin-bottom: 2rem;
}

p {
  color: var(--color-text);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .content-card {
    padding: 1.5rem;
    margin: 0 1rem;
  }
}
</style>
