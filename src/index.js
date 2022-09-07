async function getProfile() {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
  if (state && state.profile) {
    return state.profile;
  } else {
    return {};
  }
}

module.exports.onRpcRequest = async ({ request }) => {
  switch (request.method) {
    case 'confirm': {
      const result = await wallet.request({
        method: 'snap_confirm',
        params: [request.params],
      });
      return result;
    }

    case 'updateProfile': {
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', { profile: request.params }],
      });
      return await getProfile();
    }

    case 'getUserProfile': {
      return await getProfile();
    }

    case 'clearUserProfile': {
      // Use update instead of clear to update only profile state
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', { profile: {} }],
      });
      return await getProfile();
    }

    default:
      throw new Error('Method not found.');
  }
};
