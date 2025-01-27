import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "./Table";

const SelectSeat = ({ setSelectedSeat, setSelectedTable }) => {
  const { peerVideoChatSeatsOccupied, groupParticipants, groupIdToGroupName } =
    useSelector((state) => state.groups);

  const initialTables = {
    table1: {
      id: 1,
      left: { seat: [2, 45], isOccupied: false, user: null },
      right: { seat: [2, 51], isOccupied: false, user: null },
    },
    table2: {
      id: 2,
      left: { seat: [6, 45], isOccupied: false, user: null },
      right: { seat: [6, 51], isOccupied: false, user: null },
    },
    table3: {
      id: 3,
      left: { seat: [10, 45], isOccupied: false, user: null },
      right: { seat: [10, 51], isOccupied: false, user: null },
    },
    table4: {
      id: 4,
      left: { seat: [14, 45], isOccupied: false, user: null },
      right: { seat: [14, 51], isOccupied: false, user: null },
    },
    table5: {
      id: 5,
      left: { seat: [18, 45], isOccupied: false, user: null },
      right: { seat: [18, 51], isOccupied: false, user: null },
    },
  };

  const [tables, setTables] = useState(initialTables);

  useEffect(() => {
    const updatedTables = { ...tables };

    Object.entries(updatedTables).forEach(([key, value]) => {
      Object.entries(value).forEach(([k, val]) => {
        if (k !== "id") {
          const seat = val.seat;

          const occupied = peerVideoChatSeatsOccupied.some(
            ([x, y]) => x === seat[0] && y === seat[1]
          );

          if (occupied) {
            const userId = Object.entries(groupParticipants).find(
              ([, coords]) =>
                coords && coords[0] === seat[1] && coords[1] === seat[0]
            );

            if (userId) {
              updatedTables[key][k].isOccupied = true;
              updatedTables[key][k].user = userId
                ? groupIdToGroupName[userId[0]]
                : null;
            }
          }
        }
      });
    });

    setTables(updatedTables);
  }, [peerVideoChatSeatsOccupied, groupParticipants]);

  return (
    <div>
      {Object.entries(tables).map(([key, table]) => (
        <Table
          key={key}
          table={table}
          setSelectedSeat={setSelectedSeat}
          setSelectedTable={setSelectedTable}
        />
      ))}
    </div>
  );
};

export default SelectSeat;
