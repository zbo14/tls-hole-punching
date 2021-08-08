#include <arpa/inet.h>
#include <assert.h>
#include <node_api.h>
#include <string.h>
#include <sys/socket.h>

static int _bind_socket(napi_env env, napi_callback_info info) {
  size_t argc;
  napi_get_cb_info(env, info, &argc, NULL, NULL, NULL);

  napi_value argv[argc];
  napi_get_cb_info(env, info, &argc, (napi_value*)&argv, NULL, NULL);

  int srcport;
  napi_get_value_int32(env, argv[0], &srcport);

  int sockfd = socket(AF_INET, SOCK_STREAM, 0);

  if (sockfd < 0) {
    napi_throw_error(env, NULL, "Failed to create socket");

    return sockfd;
  }

  struct sockaddr_in srcaddr;
  memset(&srcaddr, 0, sizeof(srcaddr));

  srcaddr.sin_family = AF_INET;
  srcaddr.sin_addr.s_addr = INADDR_ANY;
  srcaddr.sin_port = htons(srcport);

  int code = bind(sockfd, (struct sockaddr *)&srcaddr, sizeof(srcaddr));

  if (code < 0) {
    napi_throw_error(env, NULL, "Failed to bind socket");

    return code;
  }

  return sockfd;
}

static napi_value bind_socket(napi_env env, napi_callback_info info) {
  int sockfd = _bind_socket(env, info);

  napi_value result;
  napi_status status = napi_create_int32(env, sockfd, &result);

  assert(status == napi_ok);

  return result;
}

#define DECLARE_NAPI_METHOD(name, func)                                        \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

static napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor desc1 = DECLARE_NAPI_METHOD("bindSocket", bind_socket);
  napi_status status1 = napi_define_properties(env, exports, 1, &desc1);
  assert(status1 == napi_ok);

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
