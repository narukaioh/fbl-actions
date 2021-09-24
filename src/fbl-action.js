
const defineStatusEffect = ({ id, label, icon }) =>
  CONFIG.statusEffects.push({ id, label, icon })

const urlIcon = name => `modules/fbl-actions/assets/${name}.svg`
const label = name => `EFFECT.Status${name}`

const statusEffects = [
  { id: "fastAction", label: label("FastAction"), icon: urlIcon("fastaction") },
  { id: "slowAction", label: label("SlowAction"), icon: urlIcon("slowaction") },
  { id: "dodgeAction", label: label("DodgeAction"), icon: urlIcon("dodgeaction") },
  { id: "parryAction", label: label("ParryAction"), icon: urlIcon("parryaction") },
]

Hooks.once('ready', () => {
  statusEffects.map(status => defineStatusEffect(status))

  game.settings.register("fbl-actions", "mode", {
    name: "Select where the actions will reset",
    hint: "",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "round": "Round Start",
      "turn": "When Turn Arrives"
    },
    default: "turn",
  });
})