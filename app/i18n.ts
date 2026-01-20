

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  nl: () => import('@/dictionaries/nl.json').then((module) => module.default),
  cz: () => import('@/dictionaries/cz.json').then((module) => module.default),
  sk: () => import('@/dictionaries/sk.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  if (locale in dictionaries) {
    return dictionaries[locale as keyof typeof dictionaries]()
  }
  // Fallback to English
  return dictionaries.en()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
