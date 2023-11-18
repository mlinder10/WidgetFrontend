export const boardsQuery = (ids) => {
  return `
  query {
    boards(ids: ${JSON.stringify(ids)}) {
      id
      workspace_id
      items {
        id
        group {
          id
        }
        column_values {
            type
            text
            id
        }
      }
    }
  }`;
};

export function parseBoards(boards) {
  let newBoards = [];
  for (const board of boards) {
    let newBoard = {};
    newBoard.id = board.id;
    let newItems = [];
    for (const item of board.items) {
      for (const column of item.column_values) {
        let newItem = {};
        newItem.id = item.id;
        newItem.groupId = item.group.id;
        newItem.columnId = column.id;
        newItem.value = column.text;
        newItems.push(newItem);
      }
    }
    newBoard.items = newItems;
    newBoards.push(newBoard);
  }
  return newBoards;
}

function filterItems(boards, settings, itemIds, boardIds = []) {
  let newItems = [];
  for (const board of boards) {
    // if (!boardIds.includes(board.id)) continue;
    for (const item of board.items) {
      if (
        settings?.groups?.group_ids_per_board[board.id]?.includes(
          item?.groupId
        ) &&
        settings?.columns[board.id]?.includes(item?.columnId) &&
        itemIds?.includes(parseInt(item.id)) &&
        item.value !== ""
      )
        newItems.push(item);
    }
  }
  return newItems;
}

export function getTickerValues(ticker, settings, itemIds) {
  let boards = [];
  if (ticker.length === 1) boards.push(...ticker[ticker.length - 1].boards);
  else {
    if (settings.tickerCadence === "day") {
      boards.push(...ticker[ticker.length - 2].boards);
    } else if (settings.tickerCadence === "week") {
      for (let i = 0; i < ticker.length - 1; i++) {
        if (isWithinOneWeek(ticker[i].date)) {
          boards.push(...ticker[i].boards);
        }
      }
    } else {
      for (let i = 0; i < ticker.length - 1; i++) {
        boards.push(...ticker[i].boards);
      }
    }
  }

  return {
    sum: sumFunc(boards, settings, itemIds),
    min: minFunc(boards, settings, itemIds),
    max: maxFunc(boards, settings, itemIds),
    count: countFunc(boards, settings, itemIds),
    average: averageFunc(boards, settings, itemIds),
    median: medianFunc(boards, settings, itemIds),
  };
}

export function sumFunc(boards, settings, itemIds) {
  let sum = 0;
  const items = filterItems(boards, settings, itemIds);
  for (const item of items) {
    sum += parseInt(item.value);
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
  const items = filterItems(boards, settings, itemIds);
  for (const item of items) {
    if (parseInt(item.value) < min) min = parseInt(item.value);
  }
  return min;
}

export function maxFunc(boards, settings, itemIds) {
  let max = -Infinity;
  const items = filterItems(boards, settings, itemIds);
  for (const item of items) {
    if (parseInt(item.value) > max) max = parseInt(item.value);
  }
  return max;
}

export function countFunc(boards, settings, itemIds) {
  const items = filterItems(boards, settings, itemIds);
  return items.length;
}

export function medianFunc(boards, settings, itemIds) {
  let vals = [];
  const items = filterItems(boards, settings, itemIds);
  for (const item of items) {
    vals.push(parseInt(item.value));
  }
  vals.sort();
  const count = vals.length;
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
