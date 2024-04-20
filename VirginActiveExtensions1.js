export const DatePickerExtension = {
  name: 'DatePicker',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
  render: ({ trace, element }) => {
    const datePickerContainer = document.createElement('div');
    const today = new Date().toISOString().split('T')[0];

    datePickerContainer.innerHTML = `
          <style>
            .calendar-container {
              padding: 20px; /* Vergroot de padding om de textbubble groter te maken */
              background: white;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              max-width: fit-content;
            }
            .calendar {
              border: 1px solid #ccc;
              border-radius: 5px;
              padding: 10px;
            }
            input[type="date"] {
              max-width: 200px; /* Stel een maximale breedte in om de datepicker kleiner te maken */
              padding: 10px;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 16px;
              cursor: pointer; /* Maakt het duidelijk dat je op het veld kan klikken */
            }
          </style>
          <div class="calendar-container">
            <div class="calendar">
              <input type="date" id="datePicker" name="datePicker" min="${today}">
            </div>
          </div>
        `;

    const input = datePickerContainer.querySelector('#datePicker');
    input.addEventListener('change', function (event) {
      console.log('Date selected:', event.target.value);
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { date: event.target.value },
      });
    });

    element.appendChild(datePickerContainer);
    console.log('DatePicker rendered with adjusted styles for larger bubble');
  },
};

export const TimePickerExtension = {
    name: 'TimePicker',
    type: 'response',
    match: ({ trace }) =>
        trace.type === 'ext_time_picker' || trace.payload.name === 'ext_time_picker',
    render: ({ trace, element }) => {
        console.log('Trace payload:', trace.payload); // Log to inspect the structure of trace.payload
        let availableTimes = [];

        // Check if trace.payload.availableTimes is a string that needs parsing
        if (typeof trace.payload.availableTimes === 'string') {
            try {
                availableTimes = JSON.parse(trace.payload.availableTimes);
            } catch (error) {
                console.error('Error parsing availableTimes:', error);
            }
        } else if (Array.isArray(trace.payload.availableTimes)) {
            // If it's already an array, use it directly
            availableTimes = trace.payload.availableTimes;
        } else {
            console.error('availableTimes is not in expected format:', trace.payload.availableTimes);
        }

        if (!Array.isArray(availableTimes)) {
            console.error('availableTimes is not an array after processing:', availableTimes);
            // Handle error or fallback scenario
            return; // Exit the render function early to avoid further errors
        }
        
        const timePickerContainer = document.createElement('div');
        timePickerContainer.innerHTML = `
          <style>
            .time-picker-container {
              padding: 20px;
              background: white;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              max-width: fit-content;
            }
            select.time-picker {
              padding: 10px;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 16px;
              cursor: pointer;
              margin-top: 5px;
            }
          </style>
          <div class="time-picker-container">
            <select id="timePicker" name="timePicker" class="time-picker">
              <option value="" disabled selected>Please select a time slot</option>
              ${availableTimes.map(time => `<option value="${time}">${time}</option>`).join('')}
            </select>
          </div>
        `;

        const select = timePickerContainer.querySelector('#timePicker');

        select.addEventListener('change', function (event) {
            console.log('Time slot selected:', event.target.value);
            window.voiceflow.chat.interact({
                type: 'complete',
                payload: { timeSlot: event.target.value },
            });
        });

        element.appendChild(timePickerContainer);
        console.log('TimePicker rendered with available time slots.');
    },
};