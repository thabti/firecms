export const GET_DATA = 'GET_DATA';
export function getData(links = {'data': 'hello'}) {
  return {
    type: GET_DATA,
    links
  };
}
