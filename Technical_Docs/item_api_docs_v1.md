# Item API Documentation

## Base URL

For development: `http://localhost:8000`

## Authentication

### Add Item

Adds a new item to a container. Only users with the `Manager` role can access this endpoint.

- **URL**: `/api/manager/add_item`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Authorization**: Bearer token required (JWT)

---

### Request Body

| Field        | Type     | Required | Description                                |
|--------------|----------|----------|--------------------------------------------|
| length       | float    | Yes      | Length of the item in centimeters          |
| width        | float    | Yes      | Width of the item in centimeters           |
| height       | float    | Yes      | Height of the item in centimeters          |
| orientation  | string   | No       | Item orientation, default is `"Face Up"`   |
| remarks      | string   | No       | Any extra remarks or notes about the item  |

**Example**:
```json
{
  "length": 100.0,
  "width": 50.0,
  "height": 40.0,
  "orientation": "Upright",
  "remarks": "Test item from curl"
}
