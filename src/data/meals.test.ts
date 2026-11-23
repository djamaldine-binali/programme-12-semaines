import { describe, expect, it } from 'vitest'
import { meals } from './meals'
import { program } from './program'

const recipeIds = new Set(Object.keys(meals.recipes))

describe('meals.json matches the types', () => {
  it('has the seven days of the program week, four meals each', () => {
    expect(meals.days.map((day) => day.day)).toEqual(program.week_template.map((day) => day.day))
    for (const day of meals.days) {
      expect(day.meals.map((meal) => meal.slot)).toEqual(['Petit-déjeuner', 'Déjeuner', 'Collation', 'Dîner'])
    }
  })

  it('only points to known recipes, and uses every recipe', () => {
    const used = new Set(
      meals.days.flatMap((day) => [...day.meals.map((meal) => meal.recipe), ...(day.prep ? [day.prep] : [])]),
    )
    expect(used).toEqual(recipeIds)
  })

  it('gives every ingredient a quantity for one and for two people', () => {
    for (const recipe of Object.values(meals.recipes)) {
      expect(recipe.ingredients.length).toBeGreaterThan(0)
      for (const ingredient of recipe.ingredients) {
        expect(ingredient.one).not.toBe('')
        expect(ingredient.two).not.toBe('')
      }
    }
  })

  it('splits the week into shopping lists that cover each day once', () => {
    expect(meals.shopping.flatMap((block) => block.days)).toEqual(meals.days.map((day) => day.day))
    for (const block of meals.shopping) {
      for (const list of [block.one, block.two]) {
        for (const item of list.items) {
          expect(Number.isInteger(item.price_cents) && item.price_cents > 0).toBe(true)
          expect(Number.isInteger(item.quantity) && item.quantity > 0).toBe(true)
        }
      }
    }
  })

  it('never mentions calories or weight', () => {
    expect(JSON.stringify(meals)).not.toMatch(/calorie|kcal|poids|IMC|maigrir|régime/i)
  })
})
