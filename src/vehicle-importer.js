import { parseVehicleStatblock } from "./parse-vehicle.js";

Hooks.once("ready", () => {
  game.swadeVehicleImporter = {
    async importFromText(rawText) {
      const data = parseVehicleStatblock(rawText);

      // build a Foundry “Vehicle” actor data object
      const actorData = {
        name: data.name,
        type: "vehicle",
        img: "systems/swade/img/vehicles/default.png",
        data: {
          description: { value: data.description },
          details: {
            class: data.class,
            size: data.size,
            scale: data.scale,
            speed: data.speed,
            handling: data.handling,
            crew: data.crew,
            passengers: data.passengers
          },
          attributes: {
            wounds: { value: data.wounds, max: data.wounds },
            toughness: { value: data.toughness, mod: data.mods }
          },
          resources: {
            energy: { value: data.energy }
          },
          finance: {
            cost: data.cost
          },
          notes: data.notes,
        },
        items: data.weapons.map(w => ({
          type: "weapon",
          name: w.split("(")[0].trim(),
          data: { description: { value: w } }
        }))
      };

      // create the actor
      return Actor.create(actorData);
    }
  };

  // Optionally add a UI button somewhere to paste in the statblock …
});
