HOME_DIR=$( getent passwd "$USER" | cut -d: -f6 )
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

PATH1=${HOME_DIR}/.nvm/versions/node/v16.13.0/bin
PATH2=${SCRIPT_DIR}/node_modules/.bin

if [[ ${PATH} != *${PATH1}* ]]; then PATH=$PATH1:$PATH; fi
if [[ ${PATH} != *${PATH2}* ]]; then PATH=$PATH2:$PATH; fi

echo 'SCRIPT_DIR: '${SCRIPT_DIR}

alias start-bot='npm run bot'
