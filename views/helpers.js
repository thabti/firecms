export default class Helpers {


  static addScript(url) {
    return `
      var script = document.createElement('script');

      script.type = 'text/javascript';
      script.src = '${url}';
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(script)
      `
  }

}
