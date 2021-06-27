import { CreateRoom } from "../types"
import { createRoom } from "../accounts/createRoom"
import { STATUS } from "../constants"
import { findRoomByName } from "../utils/findRoomByName"
import { findUserByEmail } from "../utils/findUserByEmail"
import { returnErrors } from "../utils/returnErrors"

export const createRoomMutation = async ({ owner, name }: CreateRoom) => {
  try {
    // Double-check if user is registered
    const userData = await findUserByEmail(owner)
    if (userData.email.address !== owner) {
      return {
        data: {
          status: STATUS.FAILURE,
          error: returnErrors("owner", "Email not registered"),
        },
      }
    }

    // Find if room exists
    const roomData = await findRoomByName(name)
    if (roomData === null) {
      // Create room
      const room = await createRoom({ name, owner })

      return {
        data: {
          status: STATUS.SUCCESS,
          room: room.ops[0],
        },
      }
    }

    return {
      data: {
        status: STATUS.FAILURE,
        error: returnErrors("name", "A room with the same name already exists."),
      },
    }
  } catch (e) {
    return {
      data: {
        status: STATUS.FAILURE,
        error: e,
      },
    }
  }
}
