export const allRoomsQuery = async () => {
  const { allRooms } = await import("../models/room")
  const rooms = await allRooms()

  return rooms
}
