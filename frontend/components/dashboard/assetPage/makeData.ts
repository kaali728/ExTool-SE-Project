import faker from "@faker-js/faker";



const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): AssetTable => {
  return {
    date: faker.date.past().toDateString(),
    status: faker.random.word(),
    destination: faker.address.streetAddress(),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): AssetTable[] => {
    const len = lens[depth]!;
    return range(len).map((d): AssetTable => {
      return {
        ...newPerson(),
      };
    });
  };

  console.log(makeDataLevel());

  return makeDataLevel();
}
