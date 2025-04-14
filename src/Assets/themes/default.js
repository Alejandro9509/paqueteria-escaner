import tinycolor from 'tinycolor2'
import { hexToRgb } from '../utils/utilsFuctions'

const primary = '#F9A03E'
const secondary = '#878789'
const terciary = '#eaeff4'

const warning = '#FFC260'
const success = '#0c992d'
const info = '#104ba3'
const danger = '#990000'
const drawerWidth = 260
const black = '#000000'

const lightenRate = 7.5
const darkenRate = 15

const primaryBoxShadow = {
    boxShadow:
        '0 4px 20px 0 rgba(' +
        hexToRgb(black) +
        ',.14), 0 7px 10px -5px rgba(' +
        hexToRgb(primary) +
        ',.4)'
}

const secondaryBoxShadow = {
    boxShadow:
        '0 4px 20px 0 rgba(' +
        hexToRgb(black) +
        ',.14), 0 7px 10px -5px rgba(' +
        hexToRgb(secondary) +
        ',.4)'
}

const infoBoxShadow = {
    boxShadow:
        '0 4px 20px 0 rgba(' +
        hexToRgb(black) +
        ',.14), 0 7px 10px -5px rgba(' +
        hexToRgb(info) +
        ',.4)'
}
const successBoxShadow = {
    boxShadow:
        '0 4px 20px 0 rgba(' +
        hexToRgb(black) +
        ',.14), 0 7px 10px -5px rgba(' +
        hexToRgb(success) +
        ',.4)'
}
const warningBoxShadow = {
    boxShadow:
        '0 4px 20px 0 rgba(' +
        hexToRgb(black) +
        ',.14), 0 7px 10px -5px rgba(' +
        hexToRgb(warning) +
        ',.4)'
}
const dangerBoxShadow = {
    boxShadow:
        '0 4px 20px 0 rgba(' +
        hexToRgb(black) +
        ',.14), 0 7px 10px -5px rgba(' +
        hexToRgb(warning) +
        ',.4)'
}

export default {
    palette: {
        primary: {
            main: primary,
            light: tinycolor(primary)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(primary)
                .darken(darkenRate)
                .toHexString(),
            contrastText: '#ffffff',
            contrast: '#606060',
        },
        secondary: {
            main: secondary,
            light: tinycolor(secondary)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(secondary)
                .darken(darkenRate)
                .toHexString(),
            contrastText: '#606060',
            contrast: '#ffffff',
        },
        terciary: {
            main: terciary,
            light: tinycolor(terciary)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(terciary)
                .darken(darkenRate)
                .toHexString(),
            contrastText: '#606060',
            contrast: '#ffffff'
        },
        warning: {
            main: warning,
            light: tinycolor(warning)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(warning)
                .darken(darkenRate)
                .toHexString()
        },
        success: {
            main: success,
            light: tinycolor(success)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(success)
                .darken(darkenRate)
                .toHexString()
        },
        info: {
            main: info,
            light: tinycolor(info)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(info)
                .darken(darkenRate)
                .toHexString()
        },
        text: {
            primary: '#4A4A4A',
            secondary: '#6E6E6E',
            hint: '#B9B9B9',
            white: '#FFFFFF'
        },
        background: {
            default: '#eaeff4',
            light: '#F3F5FF',
            gray: '#999',
            black: '#000000',
            white: '#FFFFFF'
        }
    },
    customContainer: {
        layoutContainer: {
            paddingRight: '15px',
            paddingLeft: '15px',
            marginRight: 'auto',
            marginLeft: 'auto'
        }
    },
    transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
    drawerWidth: drawerWidth,
    shadow: {
        border: '0',
        borderRadius: '3px',
        boxShadow:
            '0 10px 20px -12px rgba(' +
            hexToRgb(black) +
            ', 0.42), 0 3px 20px 0px rgba(' +
            hexToRgb(black) +
            ', 0.12), 0 8px 10px -5px rgba(' +
            hexToRgb(black) +
            ', 0.2)',
        padding: '10px 0',
        transition: 'all 150ms ease 0s'
    },
    customShadows: {
        widget:
            '0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
        widgetDark:
            '0px 3px 18px 0px #4558A3B3, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
        widgetWide:
            '0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A'
    },
    overrides: {
        // MuiTypography: {
        //   body1: {
        //     textTransform: "uppercase"
        //   },
        //   caption: {
        //     textTransform: "uppercase"
        //   }
        // },
        MuiTooltip: {
            tooltip: {
              fontSize: "16px",
            }
          },
        MuiPickersDay: {
            daySelected: {
                backgroundColor: "#0288D1",
                "&:hover": {
                    backgroundColor: "#0288D1",
                }
            }

        },
        MuiPickersCalendar: {
            week: {
                justifyContent: "space-between",
                '& div': {
                    width: "100%"
                }
            },
        },
        MuiPickersCalendarHeader: {
            daysHeader: {
                justifyContent: "space-between",
            },
        },
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: primary,
            },
        },
        // MuiPickersModal: {
        //   dialogAction: {
        //     color: tinycolor(primary)
        //         .darken(darkenRate)
        //         .toHexString(),
        //   },
        // },
        MuiMenuItem: {
            root: {
                whiteSpace: 'break-spaces'
            }
        },
        MuiAccordionSummary: {
            root: {
                '&$expanded': {
                    margin: '0px 0',
                    minHeight: '50px'
                },
            },
            content: {
                '&$expanded': {
                    margin: '0px 0'
                }
            }
        },
        MuiAccordionDetails: {
            root: {
                padding: '0px 16px 16px'
            }
        },
        MuiTextField: {
            root: {
                width: "100%"
            }
        }
    },

    cardHeader : {
        warningCardHeader: {
          background: "linear-gradient(60deg, " + warning + ", " + warning + ")",
          warningBoxShadow
        },
        successCardHeader: {
          background: "linear-gradient(60deg, " + success + ", " + success + ")",
          successBoxShadow
        },
        dangerCardHeader: {
          background: "linear-gradient(60deg, " + danger + ", " + danger + ")",
          dangerBoxShadow
        },
        infoCardHeader: {
          background: "linear-gradient(60deg, " + info + ", " + info + ")",
          infoBoxShadow
        },
        primaryCardHeader: {
          background: "linear-gradient(60deg, " + primary + ", " + primary + ")",
          primaryBoxShadow
        },
        secondaryCardHeader: {
          background: "linear-gradient(60deg, " + secondary + ", " + secondary + ")",
          secondaryBoxShadow
        }
      },
    
}
