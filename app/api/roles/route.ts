
import { supabaseAdmin } from "@/supabaseAdmin/";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";
import { errorHandler } from "@/utils/errorHandler";

  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { data, error } = await supabaseAdmin
      .from("roles")
      .select("id, name, code")
      .order("name", { ascending: true });

    if (error) return errorHandler({ error: dict.errors.roles.FAILED_TO_FETCH_ROLES }, request, lang, 500);

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.roles.FAILED_TO_FETCH_ROLES;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}
