const MAJOR_INDEX = 0;
const MINOR_INDEX = 1;
const PATCH_INDEX = 2;

class SemanticVersion
{
  constructor(major=0, minor=0, patch=0)
  {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }

  isCompatibleWith(otherVersion)
  {
    return this.major == otherVersion.major &&
      (this.minor < otherVersion.minor ||
      (this.minor == otherVersion.minor && this.patch <= otherVersion.patch));
  }

  static stringify(semanticVersion)
  {
    return semanticVersion.major + "." +
      semanticVersion.minor + "." +
      semanticVersion.patch;
  }

  static parse(string)
  {
    if (typeof string != 'string') throw new Error("Invalid argument type to parse as SemanticVersion");

    const components = string.split('.');
    if (components.length != 3) throw new Error("Invalid format for SemanticVersion");

    let major, minor, patch;
    try
    {
      major = Number.parseInt(components[MAJOR_INDEX]);
      minor = Number.parseInt(components[MINOR_INDEX]);
      patch = Number.parseInt(components[PATCH_INDEX]);
    }
    catch(e)
    {
      throw e;
    }

    return new SemanticVersion(major, minor, patch);
  }
}

export default SemanticVersion;
