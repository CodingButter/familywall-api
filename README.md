
# FamilyWall API Client

This repository contains two JavaScript modules for interacting with the FamilyWall API:

1. **FamilyWallClient** - A client that interfaces with the FamilyWall API.
2. **Family** - A supporting module for handling family-related data.

## Installation

You can import the `FamilyWallClient` and `Family` modules into your project.

### Usage

1. Ensure the `FamilyWallClient` and `Family` modules are in the same directory.
2. Import the `FamilyWallClient` class into your project:

```javascript
import FamilyWallClient from './familywall-client.js';
```

### Features

#### `FamilyWallClient`

The `FamilyWallClient` class allows you to interact with the FamilyWall API to retrieve data such as family members, profiles, and premium account details.

#### Constructor

```javascript
const client = new FamilyWallClient(options);
```

- `options` (optional): an object that allows you to specify a `timezone` or other configurations.

#### Methods

- **login(email, password)**
  - Logs into the FamilyWall API using the provided email and password.
  - Automatically handles session and cookies.

- **getWebSocketUrl()**
  - Retrieves the WebSocket URL for live updates.

- **getAllFamily()**
  - Fetches all family-related data, including members, profiles, and settings.

- **getFamily()**
  - Returns a new instance of the `Family` class populated with family data.

#### Example Usage

```javascript
import FamilyWallClient from './familywall-client.js';

(async () => {
  const client = new FamilyWallClient();
  await client.login('email@example.com', 'yourpassword');

  const familyData = await client.getFamily();
  console.log(familyData);
})();
```

---

#### `Family`

The `Family` module provides additional functionality to handle family-related data returned from the FamilyWall API.

#### Constructor

```javascript
const family = new Family(data);
```

- `data`: The raw family data returned from the `getAllFamily()` method in `FamilyWallClient`.

#### Example Usage

```javascript
import Family from './Family.js';

// Assuming you already have the family data from the FamilyWallClient
const family = new Family(familyData);
console.log(family.getMembers());
```

---

## License

This project is licensed under the MIT License.
