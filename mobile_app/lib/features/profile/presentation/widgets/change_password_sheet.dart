import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mobile_app/features/profile/domain/profile_exception.dart';
import 'package:mobile_app/features/profile/presentation/providers/profile_provider.dart';

/// Bảng đổi mật khẩu. Đóng lại với một câu thông báo khi đổi thành công.
class ChangePasswordSheet extends ConsumerStatefulWidget {
  const ChangePasswordSheet({super.key});

  @override
  ConsumerState<ChangePasswordSheet> createState() =>
      _ChangePasswordSheetState();
}

class _ChangePasswordSheetState extends ConsumerState<ChangePasswordSheet> {
  static const Color primaryColor = Color(0xFF2563EB);
  static const int minLength = 8;

  final _formKey = GlobalKey<FormState>();
  final _currentController = TextEditingController();
  final _newController = TextEditingController();
  final _confirmController = TextEditingController();

  bool _showCurrent = false;
  bool _showNew = false;
  bool _showConfirm = false;

  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _currentController.dispose();
    _newController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  String? _validateCurrent(String? value) {
    if ((value ?? '').isEmpty) return 'Vui lòng nhập mật khẩu hiện tại';
    return null;
  }

  String? _validateNew(String? value) {
    final text = value ?? '';
    if (text.length < minLength) {
      return 'Mật khẩu mới phải có ít nhất $minLength ký tự';
    }
    if (text == _currentController.text) {
      return 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }
    return null;
  }

  String? _validateConfirm(String? value) {
    if ((value ?? '').isEmpty) return 'Vui lòng nhập lại mật khẩu mới';
    if (value != _newController.text) return 'Mật khẩu nhập lại không khớp';
    return null;
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      await ref.read(profileRepositoryProvider).changePassword(
            currentPassword: _currentController.text,
            newPassword: _newController.text,
          );

      if (!mounted) return;
      Navigator.pop(context, 'Đổi mật khẩu thành công.');
    } on ProfileException catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.message;
        _saving = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Có lỗi xảy ra, vui lòng thử lại.';
        _saving = false;
      });
    }
  }

  InputDecoration _decoration({
    required String label,
    required bool visible,
    required VoidCallback onToggle,
  }) {
    return InputDecoration(
      labelText: label,
      prefixIcon: const Icon(Icons.lock_outline, color: primaryColor),
      suffixIcon: IconButton(
        icon: Icon(visible ? Icons.visibility_off : Icons.visibility),
        onPressed: onToggle,
      ),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Đổi mật khẩu',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 18),
              TextFormField(
                controller: _currentController,
                enabled: !_saving,
                obscureText: !_showCurrent,
                textInputAction: TextInputAction.next,
                validator: _validateCurrent,
                decoration: _decoration(
                  label: 'Mật khẩu hiện tại',
                  visible: _showCurrent,
                  onToggle: () => setState(() => _showCurrent = !_showCurrent),
                ),
              ),
              const SizedBox(height: 14),
              TextFormField(
                controller: _newController,
                enabled: !_saving,
                obscureText: !_showNew,
                textInputAction: TextInputAction.next,
                validator: _validateNew,
                decoration: _decoration(
                  label: 'Mật khẩu mới',
                  visible: _showNew,
                  onToggle: () => setState(() => _showNew = !_showNew),
                ),
              ),
              const SizedBox(height: 14),
              TextFormField(
                controller: _confirmController,
                enabled: !_saving,
                obscureText: !_showConfirm,
                textInputAction: TextInputAction.done,
                validator: _validateConfirm,
                onFieldSubmitted: (_) => _submit(),
                decoration: _decoration(
                  label: 'Nhập lại mật khẩu mới',
                  visible: _showConfirm,
                  onToggle: () => setState(() => _showConfirm = !_showConfirm),
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Text(_error!, style: const TextStyle(color: Colors.red)),
              ],
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _saving ? null : () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size.fromHeight(48),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Hủy'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _saving ? null : _submit,
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(48),
                        backgroundColor: primaryColor,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: _saving
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text('Đổi mật khẩu'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}