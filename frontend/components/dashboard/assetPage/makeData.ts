import faker from "@faker-js/faker";

export type Person = {
  date: string;
  status: string;
  destination: string;
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Person => {
  return {
    date: faker.date.past().toDateString(),
    status: faker.random.word(),
    destination: faker.address.streetAddress(),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
      };
    });
  };

  console.log(makeDataLevel());

  return makeDataLevel();
}
