export const normalizeInputEvent = function(event) {
  const e = {
    originalEvent: event
  };

  if (event instanceof KeyboardEvent) {
    e.key = event.key;
		e.keyCode = event.keyCode;
		if (e.key === "Process") {
			e.ignore = true;
		}
  } else {
		if (event.isComposing === true) {
			e.ignore = true;
		}
		
    e.data = event.data[event.data.length - 1];
  }

  return e;
};