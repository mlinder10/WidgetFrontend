export const boardsQuery = (ids) => {
  return `
  query {
    boards(ids: ${JSON.stringify(ids)}) {
      workspace_id
      id
      name
      items {
        id
        group {
          id
          title
        }
        column_values {
            type
            title
            text
            id
        }
      }
    }
  }`;
};

function checkGroup(item, settings, boardId, itemIds) {
  return (
    !settings?.groups?.group_ids_per_board[boardId]?.includes(
      item?.group?.id
    ) || !itemIds?.includes(parseInt(item.id))
  );
}

function checkColumn(column, settings, boardId) {
  return (
    !settings?.columns[boardId]?.includes(column?.id) ||
    column.text === null ||
    column.text === ""
  );
}

export function sumFunc(boards, settings, itemIds) {
  let sum = 0;
  for (const board of boards) {
    for (const item of board.items) {
      if (checkGroup(item, settings, board.id, itemIds)) {
        continue;
      }
      for (const column of item.column_values) {
        if (checkColumn(column, settings, board.id)) {
          continue;
        }
        sum += parseInt(column.text);
      }
    }
  }
  return sum;
}

export function averageFunc(boards, settings, itemIds) {
  const sum = sumFunc(boards, settings, itemIds);
  const count = countFunc(boards, settings, itemIds);
  return Math.floor((sum / count) * 100) / 100;
}

export function minFunc(boards, settings, itemIds) {
  let min = Infinity;
  for (const board of boards) {
    for (const item of board.items) {
      if (checkGroup(item, settings, board.id, itemIds)) {
        continue;
      }
      for (const column of item.column_values) {
        if (checkColumn(column, settings, board.id)) {
          continue;
        }
        if (parseInt(column.text) < min) min = parseInt(column.text);
      }
    }
  }
  return min;
}

export function maxFunc(boards, settings, itemIds) {
  let max = -Infinity;
  for (const board of boards) {
    for (const item of board.items) {
      if (checkGroup(item, settings, board.id, itemIds)) {
        continue;
      }
      for (const column of item.column_values) {
        if (checkColumn(column, settings, board.id)) {
          continue;
        }
        if (parseInt(column.text) > max) max = parseInt(column.text);
      }
    }
  }
  return max;
}

export function countFunc(boards, settings, itemIds) {
  let count = 0;
  for (const board of boards) {
    for (const item of board.items) {
      if (checkGroup(item, settings, board.id, itemIds)) {
        continue;
      }
      for (const column of item.column_values) {
        if (checkColumn(column, settings, board.id)) {
          continue;
        }
        count++;
      }
    }
  }
  return count;
}

export function medianFunc(boards, settings, itemIds) {
  let vals = [];
  for (const board of boards) {
    for (const item of board.items) {
      if (checkGroup(item, settings, board.id, itemIds)) {
        continue;
      }
      for (const column of item.column_values) {
        if (checkColumn(column, settings, board.id)) {
          continue;
        }
        vals.push(parseInt(column.text));
      }
    }
  }
  vals.sort();
  const count = countFunc(boards, settings);
  if (count % 2 === 0) {
    return (vals[count / 2] + vals[count / 2 + 1]) / 2;
  } else {
    return vals[Math.floor(count / 2)];
  }
}

export function isWithinOneWeek(date) {
  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  return timeDifference <= twentyFourHoursInMilliseconds;
}
