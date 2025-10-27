
// Element selectors
const ipInput = document.querySelector("#ip");
const portInput = document.querySelector("#port");
const domainInput = document.querySelector("#domain");
const fqdnInput = document.querySelector("#fqdn");
const cidrInput = document.querySelector("#cidr");

// Context-specific field selectors
const pathInput = document.querySelector("#path");
const adDomainInput = document.querySelector("#ad-domain");
const userInput = document.querySelector("#user");
const passwordInput = document.querySelector("#password");
const ntHashInput = document.querySelector("#nthash");
const serviceUserInput = document.querySelector("#service-user");
const servicePasswordInput = document.querySelector("#service-password");
const shellSelect = document.querySelector("#shell");
// const autoCopySwitch = document.querySelector("#auto-copy-switch");
const operatingSystemSelect = document.querySelector("#os-options");
const encodingSelect = document.querySelector('#encoding');
const searchBox = document.querySelector('#searchBox');

// Function to show/hide context-specific fields
const updateContextFields = (commandType) => {
    // Hide all context fields first
    const allContextFields = document.querySelectorAll('.context-fields');
    allContextFields.forEach(field => field.style.display = 'none');

    // Get references to main field containers
    const domainContainer = document.querySelector('#domain-container');
    const fqdnContainer = document.querySelector('#fqdn-container');
    const cidrContainer = document.querySelector('#cidr-container');
    const domainLabel = document.querySelector('#domain-label');
    const fqdnLabel = document.querySelector('#fqdn-label');
    const adDomainField = document.querySelector('#ad-domain-field');
    const userField = document.querySelector('#user-field');
    const passwordField = document.querySelector('#password-field');
    const adHashRow = document.querySelector('#ad-hash-row');
    const serviceUserField = document.querySelector('#service-user-field');
    const servicePasswordField = document.querySelector('#service-password-field');
    const webFields = document.querySelector('#web-fields');
    const contextSwitchWrapper = document.querySelector('#context-switch-wrapper');
    const advancedSwitchContent = document.querySelector('#advanced-switch-content');
    const kerberosSwitchContent = document.querySelector('#kerberos-switch-content');

    const show = (el, display = 'block') => {
        if (el) {
            el.style.display = display;
            el.classList.remove('d-none');
        }
    };
    const hide = (el) => {
        if (el) {
            el.style.display = 'none';
            el.classList.add('d-none');
        }
    };

    hide(domainContainer);
    hide(fqdnContainer);
    hide(cidrContainer);
    if (webFields) hide(webFields);
    hide(adDomainField);
    hide(userField);
    hide(passwordField);
    hide(adHashRow);
    hide(serviceUserField);
    hide(servicePasswordField);
    hide(contextSwitchWrapper);
    hide(advancedSwitchContent);
    hide(kerberosSwitchContent);

    // Show/hide main fields based on context
    switch (commandType) {
        case CommandType.ReverseShell:
        case CommandType.BindShell:
        case CommandType.MSFVenom:
        case CommandType.HoaxShell:
            // Only IP & Port visible
            if (domainLabel) domainLabel.textContent = 'Domain';
            if (fqdnLabel) fqdnLabel.textContent = 'FQDN';
            break;

        case CommandType.WEB:
            show(domainContainer);
            if (webFields) show(webFields);
            if (domainLabel) domainLabel.textContent = 'Web Domain';
            if (fqdnLabel) fqdnLabel.textContent = 'FQDN';
            break;

        case CommandType.ActiveDirectory:
            show(domainContainer);
            show(fqdnContainer);
            show(cidrContainer);
            show(adDomainField);
            show(userField);
            show(passwordField);
            show(adHashRow, 'flex');
            if (domainLabel) domainLabel.textContent = 'Domain';
            if (fqdnLabel) fqdnLabel.textContent = 'FQDN';
            break;

        case CommandType.CommonService:
            show(domainContainer);
            show(fqdnContainer);
            show(cidrContainer);
            show(serviceUserField);
            show(servicePasswordField);
            if (domainLabel) domainLabel.textContent = 'Domain';
            if (fqdnLabel) fqdnLabel.textContent = 'FQDN';
            break;

        default:
            // Default: show all main fields
            show(domainContainer);
            show(fqdnContainer);
            show(cidrContainer);
            if (domainLabel) domainLabel.textContent = 'Domain';
            if (fqdnLabel) fqdnLabel.textContent = 'FQDN';
            break;
    }

    // Show appropriate switch based on command type
    if (commandType === CommandType.ReverseShell ||
        commandType === CommandType.BindShell ||
        commandType === CommandType.MSFVenom ||
        commandType === CommandType.HoaxShell) {
        show(contextSwitchWrapper, 'flex');
        show(advancedSwitchContent, 'flex');
    } else if (commandType === CommandType.ActiveDirectory) {
        show(contextSwitchWrapper, 'flex');
        show(kerberosSwitchContent, 'flex');
    }
    // For Web and CommonService tabs, the entire context switch wrapper remains hidden
};
const reverseShellCommand = document.querySelector("#reverse-shell-command");
const bindShellCommand = document.querySelector("#bind-shell-command");
const msfVenomCommand = document.querySelector("#msfvenom-command");
const hoaxShellCommand = document.querySelector("#hoaxshell-command");
const webCommand = document.querySelector("#web-command");
const activeDirectoryCommand = document.querySelector("#active-directory-command");
const commonServiceCommand = document.querySelector("#common-service-command");

const FilterOperatingSystemType = {
    'All': 'all',
    'Windows': 'windows',
    'Linux': 'linux',
    'Mac': 'mac'
};

const hoaxshell_listener_types = {
	"Windows CMD cURL" : "cmd-curl",
	"PowerShell IEX" : "ps-iex",
	"PowerShell IEX Constr Lang Mode" : "ps-iex-cm",
	"PowerShell Outfile" : "ps-outfile",
	"PowerShell Outfile Constr Lang Mode" : "ps-outfile-cm",
	"Windows CMD cURL https" : "cmd-curl -c /your/cert.pem -k /your/key.pem",
	"PowerShell IEX https" : "ps-iex -c /your/cert.pem -k /your/key.pem",
	"PowerShell IEX Constr Lang Mode https" : "ps-iex-cm -c /your/cert.pem -k /your/key.pem",
	"PowerShell Outfile https" : "ps-outfile -c /your/cert.pem -k /your/key.pem",
	"PowerShell Outfile Constr Lang Mode https" : "ps-outfile-cm -c /your/cert.pem -k /your/key.pem"
};

operatingSystemSelect.addEventListener("change", (event) => {
    const selectedOS = event.target.value;
    rsg.setState({
        filterOperatingSystem: selectedOS,
    });
});

document.querySelector("#reverse-tab").addEventListener("click", () => {
    updateContextFields(CommandType.ReverseShell);
    rsg.setState({
        commandType: CommandType.ReverseShell,
    });
})

document.querySelector("#bind-tab").addEventListener("click", () => {
    updateContextFields(CommandType.BindShell);
    rsg.setState({
        commandType: CommandType.BindShell,
        encoding: "None"
});
})

document.querySelector("#bind-tab").addEventListener("click", () => {
    document.querySelector("#bind-shell-selection").innerHTML = "";
    updateContextFields(CommandType.BindShell);
    rsg.setState({
        commandType: CommandType.BindShell

    });
})

document.querySelector("#msfvenom-tab").addEventListener("click", () => {
    document.querySelector("#msfvenom-selection").innerHTML = "";
    updateContextFields(CommandType.MSFVenom);
    rsg.setState({
        commandType: CommandType.MSFVenom,
encoding: "None"
    });
});


document.querySelector("#hoaxshell-tab").addEventListener("click", () => {
    document.querySelector("#hoaxshell-selection").innerHTML = "";
    updateContextFields(CommandType.HoaxShell);
    rsg.setState({
        commandType: CommandType.HoaxShell,
		encoding: "None"
    });
});

document.querySelector("#web-tab").addEventListener("click", () => {
    document.querySelector("#web-selection").innerHTML = "";
    updateContextFields(CommandType.WEB);
    rsg.setState({
        commandType: CommandType.WEB,
        encoding: "None"
    });
});

document.querySelector("#active-directory-tab").addEventListener("click", () => {
    document.querySelector("#active-directory-selection").innerHTML = "";
    updateContextFields(CommandType.ActiveDirectory);
    rsg.setState({
        commandType: CommandType.ActiveDirectory,
        encoding: "None"
    });
});

document.querySelector("#common-service-tab").addEventListener("click", () => {
    document.querySelector("#common-service-selection").innerHTML = "";
    updateContextFields(CommandType.CommonService);
    rsg.setState({
        commandType: CommandType.CommonService,
        encoding: "None"
    });
});

var rawLinkButtons = document.querySelectorAll('.raw-listener');
for (const button of rawLinkButtons) {
    button.addEventListener("click", () => {
        const rawLink = RawLink.generate(rsg);
        window.location = rawLink;
    });
}

const filterCommandData = function (data, { commandType, filterOperatingSystem = FilterOperatingSystemType.All, filterText = '', useKerberos = false }) {
    const filtered = data.filter(item => {

        if (!item.meta.includes(commandType)) {
            return false;
        }

        // Kerberos filtering for Active Directory commands
        if (commandType === CommandType.ActiveDirectory) {
            const isKerberosCommand = item.meta.includes('kerberos');
            const hasNonKerberosVariant = data.some(otherItem =>
                otherItem.name === item.name.replace(' (kerberos)', '') ||
                otherItem.name === item.name + ' (kerberos)'
            );

            // If Kerberos is enabled, show only Kerberos versions when available
            if (useKerberos && hasNonKerberosVariant && !isKerberosCommand) {
                return false;
            }
            // If Kerberos is disabled, show only non-Kerberos versions when available
            if (!useKerberos && hasNonKerberosVariant && isKerberosCommand) {
                return false;
            }
        }

        var hasOperatingSystemMatch = (filterOperatingSystem === FilterOperatingSystemType.All) || item.meta.includes(filterOperatingSystem);
        var hasTextMatch = item.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0;
        return hasOperatingSystemMatch && hasTextMatch;
    });

    // Sort with favorites at the top (only if rsg is fully initialized)
    if (typeof rsg !== 'undefined' && rsg.sortWithFavorites) {
        return rsg.sortWithFavorites(filtered, commandType);
    }

    return filtered;
}

const query = new URLSearchParams(location.hash.substring(1));

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
const fixedEncodeURIComponent = function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

const parsePortOrDefault = function (value, defaultPort = 9001) {
    if (value === null || value === undefined) return defaultPort;

    const number = Number(value);
    const isValidPort = (Number.isSafeInteger(number) && number >= 0 && number <= 65535);
    return isValidPort ? number : defaultPort;
};

const getDefaultSelectionForType = function (commandType) {
    const items = rsgData.reverseShellCommands.filter(item => {
        if (!item.meta.includes(commandType)) {
            return false;
        }
        return true;
    });
    return items.length > 0 ? items[0].name : '';
};

const rsg = {
    ip: (query.get('ip') || localStorage.getItem('ip') || '10.10.10.10').replace(/[^a-zA-Z0-9.\-/:]/g, ''),
    port: parsePortOrDefault(query.get('port') || localStorage.getItem('port')),
    domain: (query.get('domain') || localStorage.getItem('domain') || '').replace(/[^\w.\-]/g, ''),
    fqdn: (query.get('fqdn') || localStorage.getItem('fqdn') || '').replace(/[^\w.\-]/g, ''),
    cidr: (query.get('cidr') || localStorage.getItem('cidr') || '').replace(/[^0-9a-zA-Z.\-/:]/g, ''),
    path: (query.get('path') || localStorage.getItem('path') || '').replace(/[^a-zA-Z0-9.\-/_]/g, ''),
    adDomain: (query.get('adDomain') || localStorage.getItem('adDomain') || '').replace(/[^\w.\-]/g, ''),
    user: (query.get('user') || localStorage.getItem('user') || '').replace(/[^\w.\-@]/g, ''),
    password: query.get('password') || localStorage.getItem('password') || '',
    nthash: (query.get('nthash') || localStorage.getItem('nthash') || '').replace(/[^a-fA-F0-9]/g, ''),
    favorites: JSON.parse(localStorage.getItem('favorites') || '{}'),
    useKerberos: JSON.parse(localStorage.getItem('useKerberos') || 'false'),
    payload: query.get('payload') || localStorage.getItem('payload') || 'windows/x64/meterpreter/reverse_tcp',
    payload: query.get('type') || localStorage.getItem('type') || 'cmd-curl',
    shell: query.get('shell') || localStorage.getItem('shell') || rsgData.shells[0],
    encoding: query.get('encoding') || localStorage.getItem('encoding') || 'None',
    selectedValues: {
        [CommandType.ReverseShell]: getDefaultSelectionForType(CommandType.ReverseShell),
        [CommandType.BindShell]: getDefaultSelectionForType(CommandType.BindShell),
        [CommandType.MSFVenom]: getDefaultSelectionForType(CommandType.MSFVenom),
        [CommandType.HoaxShell]: getDefaultSelectionForType(CommandType.HoaxShell),
        [CommandType.WEB]: getDefaultSelectionForType(CommandType.WEB),
        [CommandType.ActiveDirectory]: getDefaultSelectionForType(CommandType.ActiveDirectory),
        [CommandType.CommonService]: getDefaultSelectionForType(CommandType.CommonService),
    },
    commandType: CommandType.CommonService,
    filterOperatingSystem: query.get('filterOperatingSystem') || localStorage.getItem('filterOperatingSystem') || FilterOperatingSystemType.All,
    filterText: query.get('filterText') || localStorage.getItem('filterText') || '',

    uiElements: {
        [CommandType.ReverseShell]: {
            listSelection: '#reverse-shell-selection',
            command: '#reverse-shell-command'
        },
        [CommandType.BindShell]: {
            listSelection: '#bind-shell-selection',
            command: '#bind-shell-command',
        },
        [CommandType.MSFVenom]: {
            listSelection: '#msfvenom-selection',
            command: '#msfvenom-command'
        },
        [CommandType.HoaxShell]: {
            listSelection: '#hoaxshell-selection',
            command: '#hoaxshell-command'
        },
        [CommandType.WEB]: {
            listSelection: '#web-selection',
            command: '#web-command'
        },
        [CommandType.ActiveDirectory]: {
            listSelection: '#active-directory-selection',
            command: '#active-directory-command'
        },
        [CommandType.CommonService]: {
            listSelection: '#common-service-selection',
            command: '#common-service-command'
        }
    },

    copyToClipboard: (text) => {
        if (navigator ?.clipboard ?.writeText) {
            navigator.clipboard.writeText(text)
            $('#clipboard-toast').toast('show')
        } else if (window ?.clipboardData ?.setData) {
            window.clipboardData.setData('Text', text);
            $('#clipboard-toast').toast('show')
        } else {
            $('#clipboard-failure-toast').toast('show')
        }
    },

    escapeHTML: (text) => {
        let element = document.createElement('p');
        element.textContent = text;
        return element.innerHTML;
    },

    getIP: () => rsg.ip,

    getPort: () => parsePortOrDefault(rsg.port),

    getShell: () => rsg.shell,

    getEncoding: () => rsg.encoding,

    getDomain: () => rsg.domain,

    getFQDN: () => rsg.fqdn,

    getCIDR: () => rsg.cidr,

    getPath: () => rsg.path,

    getADDomain: () => rsg.adDomain,

    getUser: () => rsg.user,

    getPassword: () => rsg.password,

    getNTHash: () => rsg.nthash,

    // Favorite functionality
    isFavorite: (commandType, commandName) => {
        return rsg.favorites[commandType] && rsg.favorites[commandType].includes(commandName);
    },

    toggleFavorite: (commandType, commandName) => {
        if (!rsg.favorites[commandType]) {
            rsg.favorites[commandType] = [];
        }

        const index = rsg.favorites[commandType].indexOf(commandName);
        if (index === -1) {
            rsg.favorites[commandType].push(commandName);
        } else {
            rsg.favorites[commandType].splice(index, 1);
        }

        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(rsg.favorites));
    },

    sortWithFavorites: (items, commandType) => {
        return items.sort((a, b) => {
            const aIsFav = rsg.isFavorite(commandType, a.name);
            const bIsFav = rsg.isFavorite(commandType, b.name);

            // Favorites first
            if (aIsFav && !bIsFav) return -1;
            if (!aIsFav && bIsFav) return 1;

            // Within same category (both favorite or both not), sort alphabetically
            return a.name.localeCompare(b.name);
        });
    },

    getSelectedCommandName: () => {
        return rsg.selectedValues[rsg.commandType];
    },

    getReverseShellCommand: () => {
        const reverseShellData = rsgData.reverseShellCommands.find((item) => item.name === rsg.getSelectedCommandName());
        return reverseShellData.command;
    },

    getPayload: () => {
        if (rsg.commandType === 'MSFVenom') {
            let cmd = rsg.getReverseShellCommand();
            // msfvenom -p windows/x64/meterpreter_reverse_tcp ...
            let regex = /\s+-p\s+(?<payload>[a-zA-Z0-9/_]+)/;
            let match = regex.exec(cmd);
            if (match) {
                return match.groups.payload;
            }
        }

        return 'windows/x64/meterpreter/reverse_tcp'

    },

    getType: () => {
        if (rsg.commandType === 'HoaxShell') {
            let cmd_name = rsg.getSelectedCommandName();
            return hoaxshell_listener_types[cmd_name];
        }

        return 'cmd-curl'

    },

    generateReverseShellCommand: () => {
        let command
        if (rsg.getSelectedCommandName() === 'PowerShell #3 (Base64)') {
            const encoder = (text) => text;
            const payload = rsg.insertParameters(rsgData.specialCommands['PowerShell payload'], encoder)
                command = "powershell -e " + btoa(toBinary(payload))
            function toBinary(string) {
                const codeUnits = new Uint16Array(string.length);
                for (let i = 0; i < codeUnits.length; i++) {
                codeUnits[i] = string.charCodeAt(i);
                }
                const charCodes = new Uint8Array(codeUnits.buffer);
                let result = '';
                for (let i = 0; i < charCodes.byteLength; i++) {
                result += String.fromCharCode(charCodes[i]);
                }
                return result;
            }
        } else {
            command = rsg.getReverseShellCommand()
        }

        const encoding = rsg.getEncoding();
        if (encoding === 'Base64') {
            command = rsg.insertParameters(command, (text) => text)
            command = btoa(command)
        } else {
            function encoder(string) {
                let result = string;
                switch (encoding) {
                    case 'encodeURLDouble':
                        result = fixedEncodeURIComponent(result);
                        // fall-through
                    case 'encodeURL':
                        result = fixedEncodeURIComponent(result);
                        break;
                }
                return result;
            }
            command = rsg.escapeHTML(encoder(command));
            // NOTE: Assumes encoder doesn't produce HTML-escaped characters in parameters
            command = rsg.insertParameters(rsg.highlightParameters(command, encoder), encoder);
        }

        return command;
    },

    highlightParameters: (text, encoder) => {
        const parameters = ['{ip}', '{port}', '{shell}', '{domain}', '{fqdn}', '{cidr}', '{path}', '{user}', '{password}', '{nthash}',
            encodeURI('{ip}'), encodeURI('{port}'), encodeURI('{shell}'),
            encodeURI('{domain}'), encodeURI('{fqdn}'), encodeURI('{cidr}'), encodeURI('{path}'),
            encodeURI('{user}'), encodeURI('{password}'), encodeURI('{nthash}')
        ];

        parameters.forEach((param) => {
            if (encoder) param = encoder(param)
            text = text.replace(param, `<span class="highlighted-parameter">${param}</span>`)
        })
        return text
    },

    init: () => {
        rsg.initShells()
        rsg.syncFieldValues()
        // Initialize context fields
        updateContextFields(rsg.commandType);
        // Force update to ensure Kerberos switch visibility
        setTimeout(() => updateContextFields(rsg.commandType), 100);
        rsg.update();
    },

    syncFieldValues: () => {
        ipInput.value = rsg.ip;
        portInput.value = rsg.port;
        domainInput.value = rsg.domain;
        fqdnInput.value = rsg.fqdn;
        cidrInput.value = rsg.cidr;
        pathInput.value = rsg.path;
        adDomainInput.value = rsg.adDomain;
        userInput.value = rsg.user;
        passwordInput.value = rsg.password;
        ntHashInput.value = rsg.nthash;
        serviceUserInput.value = rsg.user;
        servicePasswordInput.value = rsg.password;

        // Sync Kerberos switch
        const kerberosSwitch = document.querySelector("#kerberos-switch");
        if (kerberosSwitch) {
            kerberosSwitch.checked = rsg.useKerberos;
        }
    },


    initShells: () => {
        rsgData.shells.forEach((shell, i) => {
            const option = document.createElement("option");

            option.selected = rsg.shell === shell;
            option.classList.add("shell-option");
            option.innerText = shell;

            shellSelect.appendChild(option);
        })
    },

    // Updates the rsg state, and forces a re-render
    setState: (newState = {}) => {
        Object.keys(newState).forEach((key) => {
            const value = newState[key];
            rsg[key] = value;
            localStorage.setItem(key, value)
        });
        Object.assign(rsg, newState);

        rsg.update();
    },

    insertParameters: (command, encoder) => {
        return command
            .replaceAll(encoder('{ip}'), encoder(rsg.getIP()))
            .replaceAll(encoder('{port}'), encoder(String(rsg.getPort())))
            .replaceAll(encoder('{shell}'), encoder(rsg.getShell()))
            .replaceAll(encoder('{domain}'), encoder(rsg.getDomain()))
            .replaceAll(encoder('{fqdn}'), encoder(rsg.getFQDN()))
            .replaceAll(encoder('{cidr}'), encoder(rsg.getCIDR()))
            .replaceAll(encoder('{path}'), encoder(rsg.getPath()))
            .replaceAll(encoder('{user}'), encoder(rsg.getUser()))
            .replaceAll(encoder('{password}'), encoder(rsg.getPassword()))
            .replaceAll(encoder('{nthash}'), encoder(rsg.getNTHash()));
    },

    update: () => {
        rsg.updateTabList()
        rsg.updateReverseShellCommand()
        rsg.updateValues()
        updateContextFields(rsg.commandType);
    },

    updateValues: () => {
        const shellOptions = shellSelect.querySelectorAll(".shell-option");
        shellOptions.forEach((option) => {
            option.selected = rsg.shell === option.value;
        });

        const encodingOptions = encodingSelect.querySelectorAll("option");
        encodingOptions.forEach((option) => {
            option.selected = rsg.encoding === option.value;
        });

        ipInput.value = rsg.ip;
        portInput.value = rsg.port;
        domainInput.value = rsg.domain;
        fqdnInput.value = rsg.fqdn;
        cidrInput.value = rsg.cidr;
        operatingSystemSelect.value = rsg.filterOperatingSystem;
        searchBox.value = rsg.filterText;
    },

    updateTabList: () => {
        const data = rsgData.reverseShellCommands;
        const filteredItems = filterCommandData(
            data,
            {
                filterOperatingSystem:  rsg.filterOperatingSystem,
                filterText: rsg.filterText,
                commandType: rsg.commandType,
                useKerberos: rsg.useKerberos
            }
        );

        const listSelectionSelector = rsg.uiElements[rsg.commandType].listSelection;
        const listElement = document.querySelector(listSelectionSelector);
        const previousScrollTop = listElement ? listElement.scrollTop : 0;

        const documentFragment = document.createDocumentFragment();
        if (filteredItems.length === 0) {
            const emptyMessage = document.createElement("button");
            emptyMessage.innerText = "No results found";
            emptyMessage.classList.add("list-group-item", "list-group-item-action", "disabled");

            documentFragment.appendChild(emptyMessage);
        }
        filteredItems.forEach((item, index) => {
            const {
                name,
                command
            } = item;

            const selectionButton = document.createElement("button");

            if (rsg.getSelectedCommandName() === item.name) {
                selectionButton.classList.add("active");
            }

            const clickEvent = (e) => {
                // Don't trigger selection if clicking on star button
                if (e.target.classList.contains('favorite-star')) {
                    return;
                }
                rsg.selectedValues[rsg.commandType] = name;
                rsg.update();
            }

            // Create container for text and star
            const contentContainer = document.createElement("div");
            contentContainer.classList.add("d-flex", "justify-content-between", "align-items-center", "w-100");

            const commandText = document.createElement("span");
            commandText.innerText = name;

            // Create star button
            const starButton = document.createElement("span");
            starButton.classList.add("favorite-star");
            const isFavorite = rsg.isFavorite ? rsg.isFavorite(rsg.commandType, name) : false;
            starButton.innerHTML = isFavorite ? "★" : "☆";
            starButton.style.cursor = "pointer";
            starButton.style.color = isFavorite ? "#ffd700" : "#ccc";
            starButton.style.fontSize = "16px";
            starButton.style.marginLeft = "auto";
            starButton.setAttribute("title", "Toggle favorite");

            starButton.addEventListener("click", (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (rsg.toggleFavorite) {
                    rsg.toggleFavorite(rsg.commandType, name);
                    // Update star appearance
                    const isFav = rsg.isFavorite ? rsg.isFavorite(rsg.commandType, name) : false;
                    starButton.innerHTML = isFav ? "★" : "☆";
                    starButton.style.color = isFav ? "#ffd700" : "#ccc";
                    // Re-render list to move favorites to top
                    if (rsg.updateTabList) {
                        rsg.updateTabList();
                    }
                }
            });

            contentContainer.appendChild(commandText);
            contentContainer.appendChild(starButton);
            selectionButton.appendChild(contentContainer);

            selectionButton.classList.add("list-group-item", "list-group-item-action");
            selectionButton.addEventListener("click", clickEvent);

            documentFragment.appendChild(selectionButton);
        })

        if (listElement) {
            listElement.replaceChildren(documentFragment);
            listElement.scrollTop = previousScrollTop;
        }
    },


    updateReverseShellSelection: () => {
        document.querySelector(".list-group-item.active") ?.classList.remove("active");
        const elements = Array.from(document.querySelectorAll(".list-group-item"));
        const selectedElement = elements.find((item) => item.innerText === rsg.currentCommandName);
        selectedElement?.classList.add("active");
    },

    updateReverseShellCommand: () => {
        const command = rsg.generateReverseShellCommand();
        const commandSelector = rsg.uiElements[rsg.commandType].command;
        document.querySelector(commandSelector).innerHTML = command;
    },

    updateSwitchStates: () => {
        // Only update revshell advanced since it's the only tab with an advanced switch
        const revshellSwitch = $('#revshell-advanced-switch');
        if (revshellSwitch.length) {
            $('#revshell-advanced').collapse(revshellSwitch.prop('checked') ? 'show' : 'hide');
        }
    }
}

/*
    * Init
    */
rsg.init();
rsg.update();

/*
    * Event handlers/functions
    */
ipInput.addEventListener("input", (e) => {
    const sanitized = e.target.value.replace(/[^0-9a-zA-Z.\-/:]/g, '');
    rsg.setState({
        ip: sanitized
    })
});

portInput.addEventListener("input", (e) => {
    const value = e.target.value.length === 0 ? '0' : e.target.value;
    rsg.setState({
        port: parsePortOrDefault(value, rsg.getPort())
    })
});

domainInput.addEventListener("input", (e) => {
    const sanitized = e.target.value.replace(/[^\w.\-]/g, '');
    rsg.setState({
        domain: sanitized
    })
});

fqdnInput.addEventListener("input", (e) => {
    const sanitized = e.target.value.replace(/[^\w.\-]/g, '');
    rsg.setState({
        fqdn: sanitized
    })
});

cidrInput.addEventListener("input", (e) => {
    const sanitized = e.target.value.replace(/[^0-9a-zA-Z.\-/:]/g, '');
    rsg.setState({
        cidr: sanitized
    })
});

// Add event listeners for new context-specific fields
pathInput.addEventListener("input", (e) => {
    const sanitized = e.target.value.replace(/[^a-zA-Z0-9.\-/_]/g, '');
    rsg.setState({
        path: sanitized
    })
});

adDomainInput.addEventListener("input", (e) => {
    const sanitized = e.target.value.replace(/[^\w.\-]/g, '');
    rsg.setState({
        adDomain: sanitized
    })
});

userInput.addEventListener("input", (e) => {
    const sanitized = e.target.value.replace(/[^\w.\-@]/g, '');
    rsg.setState({
        user: sanitized
    })
});

passwordInput.addEventListener("input", (e) => {
    rsg.setState({
        password: e.target.value
    })
});

ntHashInput.addEventListener("input", (e) => {
    const sanitized = e.target.value.replace(/[^a-fA-F0-9]/g, '');
    rsg.setState({
        nthash: sanitized
    })
});

serviceUserInput.addEventListener("input", (e) => {
    const sanitized = e.target.value.replace(/[^\w.\-@]/g, '');
    rsg.setState({
        user: sanitized
    })
});

servicePasswordInput.addEventListener("input", (e) => {
    rsg.setState({
        password: e.target.value
    })
});

// Kerberos switch event listener
const kerberosSwitch = document.querySelector("#kerberos-switch");
if (kerberosSwitch) {
    kerberosSwitch.addEventListener("change", (e) => {
        rsg.setState({
            useKerberos: e.target.checked
        });
    });
}


shellSelect.addEventListener("change", (e) => {
    rsg.setState({
        shell: e.target.value
    })
});

encodingSelect.addEventListener("change", (e) => {
    rsg.setState({
        encoding: e.target.value
    })
});

searchBox.addEventListener("input", (e) => {
    rsg.setState({
        filterText: e.target.value
    })
});

document.querySelector('#inc-port').addEventListener('click', () => {
    rsg.setState({
        port: rsg.getPort() + 1
    })
})

document.querySelector('#revshell-advanced-switch').addEventListener('change', rsg.updateSwitchStates);

setInterval(rsg.updateSwitchStates, 500) // fix switch changes in rapid succession

document.querySelector('#copy-reverse-shell-command').addEventListener('click', () => {
    rsg.copyToClipboard(reverseShellCommand.innerText)
})

document.querySelector('#copy-bind-shell-command').addEventListener('click', () => {
    rsg.copyToClipboard(bindShellCommand.innerText)
})

document.querySelector('#copy-msfvenom-command').addEventListener('click', () => {
    rsg.copyToClipboard(msfVenomCommand.innerText)
})

document.querySelector('#copy-hoaxshell-command').addEventListener('click', () => {
    rsg.copyToClipboard(hoaxShellCommand.innerText)
})

document.querySelector('#copy-web-command').addEventListener('click', () => {
    rsg.copyToClipboard(webCommand.innerText)
})

document.querySelector('#copy-active-directory-command').addEventListener('click', () => {
    rsg.copyToClipboard(activeDirectoryCommand.innerText)
})

document.querySelector('#copy-common-service-command').addEventListener('click', () => {
    rsg.copyToClipboard(commonServiceCommand.innerText)
})

reverseShellCommand.addEventListener('click', () => {
    rsg.copyToClipboard(reverseShellCommand.innerText)
})

bindShellCommand.addEventListener('click', () => {
    rsg.copyToClipboard(bindShellCommand.innerText)
})

msfVenomCommand.addEventListener('click', () => {
    rsg.copyToClipboard(msfVenomCommand.innerText)
})

hoaxShellCommand.addEventListener('click', () => {
    rsg.copyToClipboard(hoaxShellCommand.innerText)
})

webCommand.addEventListener('click', () => {
    rsg.copyToClipboard(webCommand.innerText)
})

activeDirectoryCommand.addEventListener('click', () => {
    rsg.copyToClipboard(activeDirectoryCommand.innerText)
})

commonServiceCommand.addEventListener('click', () => {
    rsg.copyToClipboard(commonServiceCommand.innerText)
})

var downloadButton = document.querySelectorAll(".download-svg");
for (const Dbutton of downloadButton) {
    Dbutton.addEventListener("click", () => {
        const filename = prompt('Enter a filename', 'payload.sh')
        if(filename===null)return;
        const rawLink = RawLink.generate(rsg);
        axios({
            url: rawLink,
            method: 'GET',
            responseType: 'arraybuffer',
        })
        .then((response)=>{
            const url = window.URL.createObjectURL(new File([response.data], filename ));
            const downloadElement = document.createElement("a");
            downloadElement.href = url;
            downloadElement.setAttribute('download', filename);
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
        });
    });
}

// autoCopySwitch.addEventListener("change", () => {
//     setLocalStorage(autoCopySwitch, "auto-copy", "checked");
// });

// Popper tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

// TODO: add a random fifo for netcat mkfifo
//let randomId = Math.random().toString(36).substring(2, 4);
