
const defineStatusEffect = ({ id, label, icon }) =>
  CONFIG.statusEffects.push({ id, label, icon })

const urlIcon = name => `modules/fbl-actions/assets/${name}.svg`

const statusEffects = [
  { id: "fastAction", label: "Fast Action", icon: urlIcon("fastaction"), isBattleAction: true },
  { id: "slowAction", label: "Slow Action", icon: urlIcon("slowaction"), isBattleAction: true },
  { id: "dodgeAction", label: "Dodge Action", icon: urlIcon("dodgeaction"), isBattleAction: true },
  { id: "parryAction", label: "Parry Action", icon: urlIcon("parryaction"), isBattleAction: true },
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

const isRound = () => game.settings.get("fbl-actions", "mode") === "round"

const getCurrentToken = event => canvas.tokens.get(event.current.tokenId)

const isInitialTurn = event => event.current.turn === 0

const removeIconActions = async token => {
  // const status = statusEffects.filter(status => status.isBattleAction).map(status => status.id)
  // const keys = tokens.actor.effects.filter(token => status.includes(token.getFlag("core", "statusId"))).map(key => key.data._id)
  // await keys.map(async key => await tokens.actor.effects.delete(key))

  const slowAction = token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "slowAction");
  const fastAction = token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "fastAction");
  const dodgeAction = token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "dodgeAction");
  const parryAction = token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "parryAction");

  if (slowAction != undefined) await slowAction.delete();
  if (fastAction != undefined) await fastAction.delete();
  if (dodgeAction != undefined) await dodgeAction.delete();
  if (parryAction != undefined) await parryAction.delete();
}

const getTokens = () => canvas.tokens.children[0].children

Hooks.on('updateCombat', event => {

  if (game.user.isGM) {
    const currentToken = getCurrentToken(event)
    if (isRound()) {
      const actor = currentToken.actor
      if (isInitialTurn(event)) {
        getTokens().map(token => removeIconActions(token))
      } else {
        if (actor.data.data.attributes.agility.value > 1) {
          removeIconActions(currentToken)
        }
      }
    } else {
      getTokens()
        .filter(token => token.data.name === currentToken.name)
        .map(token => removeIconActions(token))
    }
  }

})

Hooks.on('deleteCombat', async function (e) {
  getTokens().map(token => removeIconActions(token));
});