class Storage
{
  static saveToLocalStorage(id, string)
  {
    localStorage.setItem(id, string);
  }

  static loadFromLocalStorage(id)
  {
    return localStorage.getItem(id);
  }
}

export default Storage;
