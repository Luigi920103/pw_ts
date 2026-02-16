// import { Locator, Page } from "@playwright/test";
// import { BasePage } from "./basePage";

// interface MonsterData {
//   monsterImageNo?: string | number;
//   name?: string;
//   hp?: number;
//   attack?: number;
//   defense?: number;
//   speed?: number;
//   submit?: boolean;
// }

// const testIds = {
//   monsterCardTestIds: {
//     favBtn: "favorite-btn",
//     monsterImg: "monster-image",
//     deleteBtn: "btn-delete",
//   },
//   createdMonsterFormTestIds: {
//     image: "monster-{number}",
//     alert: "alert-required-fields",
//     name: "monster-name",
//     hp: "hp-value",
//     attack: "attack-value",
//     defense: "defense-value",
//     speed: "speed-value",
//     createMonsterBtnDisabled: "btn-create-monster-disabled",
//     createMonsterBtn: "btn-create-monster",
//     inputFilter: "#outlined-required",
//   },
//   monstersListTestIds: {
//     listTitle: "monster-list-title",
//     section: "monsters-list-section",
//   },
//   sectionTitlesTestIds: {
//     title: "app-name",
//     monstersTitle: "dynamic-title",
//   },
// } as const;

// export default class HomePage extends BasePage {
//   // Definición de las propiedades de tipo Locator u objetos de Locators
//   public readonly monsterCard: {
//     favBtn: Locator;
//     monsterImg: Locator;
//     deleteBtn: Locator;
//   };

//   public readonly createdMonsterForm: {
//     imageSelected: (monsterNumber?: string | number) => Locator;
//     alert: Locator;
//     nameInput: Locator;
//     hpInput: Locator;
//     attackInput: Locator;
//     defenseInput: Locator;
//     speedInput: Locator;
//     createMonsterBtnDisabled: Locator;
//     createMonsterBtn: Locator;
//   };

//   public readonly monstersList: {
//     listTitle: Locator;
//     section: Locator;
//   };

//   public readonly sectionTitles: {
//     title: Locator;
//     monstersTitle: Locator;
//   };

//   constructor(page: Page) {
//     super(page);

//     // Helper interno para evitar repetición en el formulario
//     const getField = (id: string) =>
//         this.page.getByTestId(id).locator(testIds.createdMonsterFormTestIds.inputFilter);

//     // Inicialización en el Constructor
//     this.monsterCard = {
//       favBtn: this.page.getByTestId(testIds.monsterCardTestIds.favBtn),
//       monsterImg: this.page.getByTestId(testIds.monsterCardTestIds.monsterImg),
//       deleteBtn: this.page.getByTestId(testIds.monsterCardTestIds.deleteBtn),
//     };

//     this.createdMonsterForm = {
//       // Nota: Los selectores dinámicos siguen siendo funciones, pero viven dentro del objeto definido en el constructor
//       imageSelected: (monsterNumber: string | number = 1) =>
//         this.page.getByTestId(
//           testIds.createdMonsterFormTestIds.image.replace("{number}", monsterNumber.toString())
//         ),
//       alert: this.page.getByTestId(testIds.createdMonsterFormTestIds.alert),
//       nameInput: getField(testIds.createdMonsterFormTestIds.name),
//       hpInput: getField(testIds.createdMonsterFormTestIds.hp),
//       attackInput: getField(testIds.createdMonsterFormTestIds.attack),
//       defenseInput: getField(testIds.createdMonsterFormTestIds.defense),
//       speedInput: getField(testIds.createdMonsterFormTestIds.speed),
//       createMonsterBtnDisabled: this.page.getByTestId(testIds.createdMonsterFormTestIds.createMonsterBtnDisabled),
//       createMonsterBtn: this.page.getByTestId(testIds.createdMonsterFormTestIds.createMonsterBtn),
//     };

//     this.monstersList = {
//       listTitle: this.page.getByTestId(testIds.monstersListTestIds.listTitle),
//       section: this.page.getByTestId(testIds.monstersListTestIds.section),
//     };

//     this.sectionTitles = {
//       title: this.page.getByTestId(testIds.sectionTitlesTestIds.title),
//       monstersTitle: this.page.getByTestId(testIds.sectionTitlesTestIds.monstersTitle),
//     };
//   }

//   // Los métodos de acción permanecen iguales, ya que llaman a los Locators ya definidos
//   async createMonster(data: MonsterData = {}) {
//     const { monsterImageNo, name, hp, attack, defense, speed, submit = true } = data;

//     if (monsterImageNo !== undefined)
//       await this.createdMonsterForm.imageSelected(monsterImageNo).click();

//     if (name !== undefined) await this.createdMonsterForm.nameInput.fill(name);
//     if (hp !== undefined) await this.createdMonsterForm.hpInput.fill(hp.toString());
//     if (attack !== undefined) await this.createdMonsterForm.attackInput.fill(attack.toString());
//     if (defense !== undefined) await this.createdMonsterForm.defenseInput.fill(defense.toString());
//     if (speed !== undefined) await this.createdMonsterForm.speedInput.fill(speed.toString());

//     if (submit) await this.createdMonsterForm.createMonsterBtn.click();
//   }

//   async createDefaultMonster(name: string = "default monster") {
//     await this.createMonster({
//       monsterImageNo: 3,
//       name: name,
//       hp: 50,
//       attack: 50,
//       defense: 50,
//       speed: 50,
//     });
//   }
// }
